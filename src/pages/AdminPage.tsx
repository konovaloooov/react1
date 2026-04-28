import { FormEvent, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { ForbiddenPage } from './ForbiddenPage';
import { addProduct, editProduct, removeProduct, toggleProductAvailability } from '../store/slices/productsSlice';
import { Product } from '../types/shop';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatPrice } from '../utils/formatPrice';

export function AdminPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const { currentUser, isInitialized } = useAppSelector((state) => state.user);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('100');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const resetForm = () => {
    setEditingProduct(null);
    setName('');
    setPrice('100');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingProduct) {
      dispatch(
        editProduct({
          ...editingProduct,
          name,
          price: Number(price),
        }),
      );
      resetForm();
      return;
    }

    dispatch(
      addProduct({
        name,
        price: Number(price),
        category: 'cakes',
        image: 'https://via.placeholder.com/300x180?text=Cake',
        description: 'Новый товар',
        weight: '500 г',
        rating: 4,
        inStock: true,
      }),
    );
    resetForm();
  };

  const startEditing = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
  };

  if (!isInitialized) {
    return null;
  }

  if (currentUser?.role !== 'admin') {
    return <ForbiddenPage />;
  }

  return (
    <section className="page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="mb-1">Админ-страница</h1>
          <p className="text-muted mb-0">Добавление, редактирование, изменение наличия и снятие товаров с продажи.</p>
        </div>
      </div>

      <form className="card mb-4" onSubmit={handleSubmit}>
        <div className="card-body">
          <h2 className="h5 mb-3">{editingProduct ? 'Редактирование товара' : 'Добавление товара'}</h2>
          <div className="row g-3 align-items-end">
            <div className="col-md">
              <Input label="Название" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="col-md-3">
              <Input label="Цена" type="number" value={price} onChange={(event) => setPrice(event.target.value)} required />
            </div>
            <div className="col-md-auto">
              <Button type="submit">{editingProduct ? 'Сохранить изменения' : 'Добавить товар'}</Button>
            </div>
            {editingProduct && (
              <div className="col-md-auto">
                <Button variant="secondary" type="button" onClick={resetForm}>
                  Отмена
                </Button>
              </div>
            )}
            <div className="col-12">
              <span className="text-muted small">
                {editingProduct
                  ? `Будет отправлен PUT-запрос для товара #${editingProduct.id}`
                  : 'Будет отправлен POST-запрос для нового товара'}
              </span>
            </div>
          </div>
        </div>
      </form>

      <div className="alert alert-light border">
        <strong>Действия:</strong> “Редактировать” - PUT, “Наличие” -
        PATCH, “Снять с продажи” - DELETE.
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Название</th>
              <th>Цена</th>
              <th>Наличие</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  <StatusBadge isActive={product.inStock} activeText="есть" inactiveText="нет" />
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Button variant="secondary" className="btn-sm" onClick={() => startEditing(product)}>
                      Редактировать
                    </Button>
                    <Button variant="outline" className="btn-sm" onClick={() => dispatch(toggleProductAvailability(product))}>
                      Наличие
                    </Button>
                    <Button variant="danger" className="btn-sm" onClick={() => dispatch(removeProduct(product.id))}>
                      Снять с продажи
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
