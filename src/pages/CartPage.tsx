import { FormEvent, useState } from 'react';
import { CartItemRow } from '../components/CartItemRow';
import { clearCart, decreaseQuantity, increaseQuantity, removeFromCart } from '../store/slices/cartSlice';
import { submitOrder } from '../store/slices/ordersSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { formatPrice } from '../utils/formatPrice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const order = await dispatch(submitOrder({ customerName, phone, address, comment }));

    if (order) {
      dispatch(clearCart());
      setCustomerName('');
      setPhone('');
      setAddress('');
      setComment('');
    }
  };

  return (
    <section className="page">
      <h1 className="mb-4">Корзина</h1>
      <div className="row g-4">
        <div className="col-lg-7">
          {items.length === 0 && <div className="alert alert-info">Корзина пустая.</div>}
          <div className="vstack gap-3">
            {items.map((item) => (
              <CartItemRow
                item={item}
                key={item.product.id}
                onDecrease={(productId) => dispatch(decreaseQuantity(productId))}
                onIncrease={(productId) => dispatch(increaseQuantity(productId))}
                onRemove={(productId) => dispatch(removeFromCart(productId))}
              />
            ))}
          </div>
          <h2 className="h4 mt-4">Итого: {formatPrice(total)}</h2>
        </div>

        <div className="col-lg-5">
          <form className="card" onSubmit={handleSubmit}>
            <div className="card-body">
              <h2 className="h4">Оформление заказа</h2>
              <Input label="Имя" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
              <Input label="Телефон" value={phone} onChange={(event) => setPhone(event.target.value)} required />
              <Input label="Адрес" value={address} onChange={(event) => setAddress(event.target.value)} required />
              <Input label="Комментарий" value={comment} onChange={(event) => setComment(event.target.value)} />
              <Button className="w-100 mt-2" type="submit" disabled={items.length === 0}>
                Оформить
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
