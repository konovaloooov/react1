import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <section className="page text-center">
      <h1 className="display-3">403</h1>
      <p className="text-muted">Доступ запрещён. В админ-панель может попасть только администратор.</p>
      <Link className="btn btn-primary" to="/catalog">
        Вернуться в каталог
      </Link>
    </section>
  );
}
