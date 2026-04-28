import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

export function DashboardPage() {
  const user = useAppSelector((state) => state.user.currentUser);
  const productsCount = useAppSelector((state) => state.products.items.length);
  const cartCount = useAppSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <section className="page">
      <h1>Статистика пользователя</h1>
      <p className="text-muted">Здравствуйте, {user?.name}.</p>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <span className="text-muted">Товаров в каталоге</span>
              <h2 className="display-6">{productsCount}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <span className="text-muted">Товаров в корзине</span>
              <h2 className="display-6">{cartCount}</h2>
            </div>
          </div>
        </div>
      </div>
      <Link className="btn btn-outline-primary" to="/profile">Перейти в личный кабинет</Link>
    </section>
  );
}
