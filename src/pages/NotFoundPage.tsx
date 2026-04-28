import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="page text-center">
      <h1 className="display-3">404</h1>
      <p className="text-muted">Страница не найдена.</p>
      <Link className="btn btn-primary" to="/">Вернуться на главную</Link>
    </section>
  );
}
