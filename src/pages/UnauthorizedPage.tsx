import { Link } from 'react-router-dom';

interface UnauthorizedPageProps {
  from: string;
}

export function UnauthorizedPage({ from }: UnauthorizedPageProps) {
  return (
    <section className="page text-center">
      <h1 className="display-3">401</h1>
      <p className="text-muted">Для просмотра этой страницы нужно авторизоваться.</p>
      <Link className="btn btn-primary" to={`/login?from=${encodeURIComponent(from)}`}>
        Перейти на страницу входа
      </Link>
    </section>
  );
}
