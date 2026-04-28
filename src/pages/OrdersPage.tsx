import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { ForbiddenPage } from './ForbiddenPage';
import { fetchOrders } from '../store/slices/ordersSlice';
import { formatPrice } from '../utils/formatPrice';

export function OrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.items);
  const { currentUser, isInitialized } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      dispatch(fetchOrders());
    }
  }, [currentUser?.role, dispatch]);

  if (!isInitialized) {
    return null;
  }

  if (currentUser?.role !== 'admin') {
    return <ForbiddenPage />;
  }

  return (
    <section className="page">
      <h1 className="mb-4">Заказы</h1>
      {orders.length === 0 && <div className="alert alert-info">Заказов пока нет.</div>}
      <div className="vstack gap-3">
        {orders.map((order) => (
          <div className="card" key={order.id}>
            <div className="card-body">
              <b>Заказ #{order.id}</b>
              <p className="mb-1">Покупатель: {order.customerName}</p>
              <p className="mb-0">Сумма: {formatPrice(order.total)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
