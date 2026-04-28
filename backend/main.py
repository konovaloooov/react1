from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any, Optional
import hashlib
import json
import secrets

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, EmailStr


app = FastAPI(title="Tortomaster API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)
tokens_db: dict[str, str] = {}
db_path = Path(__file__).resolve().parent.parent / "db.json"


def load_db() -> dict[str, Any]:
    with db_path.open(encoding="utf-8") as file:
        return json.load(file)


def save_db(data: dict[str, Any]) -> None:
    with db_path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
        file.write("\n")


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def user_response(user: dict[str, Any]) -> dict[str, Any]:
    return {key: value for key, value in user.items() if key not in {"password", "passwordHash"}}


def find_user_by_id(user_id: str) -> Optional[dict[str, Any]]:
    data = load_db()
    return next((user for user in data.get("users", []) if str(user.get("id")) == str(user_id)), None)


def password_matches(user: dict[str, Any], password: str) -> bool:
    if user.get("passwordHash"):
        return user["passwordHash"] == hash_password(password)
    return user.get("password") == password


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict[str, Any]:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Требуется авторизация")

    user_id = tokens_db.get(credentials.credentials)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Недействительный токен")

    user = find_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не найден")

    return user


def get_admin_user(current_user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав")
    return current_user


def next_id(items: list[dict[str, Any]]) -> str:
    numeric_ids = [int(item["id"]) for item in items if str(item.get("id", "")).isdigit()]
    return str(max(numeric_ids, default=0) + 1)


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class RegisterPayload(LoginPayload):
    name: str
    phone: str


class ProductPayload(BaseModel):
    name: str
    category: str
    price: float
    image: str
    description: str
    weight: str
    rating: float = 4
    inStock: bool = True
    isHit: Optional[bool] = None


class ProductPatchPayload(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    description: Optional[str] = None
    weight: Optional[str] = None
    rating: Optional[float] = None
    inStock: Optional[bool] = None
    isHit: Optional[bool] = None


class OrderItemPayload(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int


class OrderPayload(BaseModel):
    customerName: str
    phone: str
    address: str
    comment: str = ""
    items: list[OrderItemPayload]
    total: float


@app.post("/auth/login")
def login(payload: LoginPayload) -> dict[str, Any]:
    data = load_db()
    email = payload.email.strip().lower()
    user = next((candidate for candidate in data.get("users", []) if candidate.get("email", "").lower() == email), None)

    if not user or not password_matches(user, payload.password):
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    token = secrets.token_hex(32)
    tokens_db[token] = str(user["id"])
    return {"access_token": token, "token_type": "bearer", "user": user_response(user)}


@app.post("/auth/register", status_code=201)
def register(payload: RegisterPayload) -> dict[str, Any]:
    data = load_db()
    email = payload.email.strip().lower()

    if any(user.get("email", "").lower() == email for user in data.get("users", [])):
        raise HTTPException(status_code=400, detail="Email уже используется")

    user = {
        "id": next_id(data.get("users", [])),
        "name": payload.name.strip(),
        "email": email,
        "phone": payload.phone.strip(),
        "passwordHash": hash_password(payload.password),
        "role": "user",
    }
    data.setdefault("users", []).append(user)
    save_db(data)

    token = secrets.token_hex(32)
    tokens_db[token] = str(user["id"])
    return {"access_token": token, "token_type": "bearer", "user": user_response(user)}


@app.get("/users/me")
def get_me(current_user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
    return user_response(current_user)


@app.get("/products")
def get_products() -> list[dict[str, Any]]:
    return load_db().get("products", [])


@app.post("/products", status_code=201)
def create_product(payload: ProductPayload, _: dict[str, Any] = Depends(get_admin_user)) -> dict[str, Any]:
    data = load_db()
    product = payload.model_dump()
    product["id"] = next_id(data.get("products", []))
    data.setdefault("products", []).append(product)
    save_db(data)
    return product


@app.put("/products/{product_id}")
def replace_product(
    product_id: str,
    payload: ProductPayload,
    _: dict[str, Any] = Depends(get_admin_user),
) -> dict[str, Any]:
    data = load_db()
    products = data.get("products", [])
    index = next((idx for idx, product in enumerate(products) if str(product.get("id")) == product_id), None)

    if index is None:
        raise HTTPException(status_code=404, detail="Товар не найден")

    product = payload.model_dump()
    product["id"] = product_id
    products[index] = product
    save_db(data)
    return product
 

@app.patch("/products/{product_id}")
def update_product(
    product_id: str,
    payload: ProductPatchPayload,
    _: dict[str, Any] = Depends(get_admin_user),
) -> dict[str, Any]:
    data = load_db()
    product = next((item for item in data.get("products", []) if str(item.get("id")) == product_id), None)

    if not product:
        raise HTTPException(status_code=404, detail="Товар не найден")

    product.update(payload.model_dump(exclude_none=True))
    save_db(data)
    return product


@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: str, _: dict[str, Any] = Depends(get_admin_user)) -> None:
    data = load_db()
    products = data.get("products", [])
    filtered_products = [product for product in products if str(product.get("id")) != product_id]

    if len(filtered_products) == len(products):
        raise HTTPException(status_code=404, detail="Товар не найден")

    data["products"] = filtered_products
    save_db(data)


@app.get("/orders")
def get_orders(_: dict[str, Any] = Depends(get_admin_user)) -> list[dict[str, Any]]:
    return load_db().get("orders", [])


@app.post("/orders", status_code=201)
def create_order(
    payload: OrderPayload,
    current_user: dict[str, Any] = Depends(get_current_user),
) -> dict[str, Any]:
    data = load_db()
    order = deepcopy(payload.model_dump())
    order["id"] = next_id(data.get("orders", []))
    order["userId"] = str(current_user["id"])
    order["createdAt"] = datetime.now().isoformat()
    data.setdefault("orders", []).append(order)
    save_db(data)
    return order
