import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <section className="page hero d-flex align-items-center">
      <div>
        <h1 className="display-5 fw-bold">Интернет-магазин кондитерских изделий</h1>
        <p className="lead mt-3">
          Торты, эклеры, печенье и подарочные наборы. Ждём ваших заказов!
        </p>
        <Link className="btn btn-primary btn-lg mt-2" to="/catalog">
          Открыть каталог
        </Link>
      </div>
    </section>
  );
}
