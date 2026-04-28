import { Link } from 'react-router-dom';
import { User } from '../types/shop';
import { Button } from '../ui/Button';

interface NavbarProps {
  isAuth: boolean;
  currentUser: User | null;
  onLogout: () => void;
}

export function Navbar({ isAuth, currentUser, onLogout }: NavbarProps) {
  return (
    <header className="top">
      <div className="container py-3 d-flex flex-wrap align-items-center gap-3">
        <Link className="brand me-auto" to="/">
          Тортомастер
        </Link>
        <nav className="d-flex flex-wrap align-items-center gap-2">
          <Link className="nav-link" to="/catalog">
            Каталог
          </Link>
          <Link className="nav-link" to="/cart">
            Корзина
          </Link>
          {isAuth ? (
            <>
              {currentUser?.role === 'admin' && (
                <>
                  <Link className="nav-link" to="/admin">
                    Админ
                  </Link>
                  <Link className="nav-link" to="/orders">
                    Заказы
                  </Link>
                </>
              )}
              <Link className="nav-link" to="/dashboard">
                Статистика
              </Link>
              <Link className="nav-link" to="/profile">
                {currentUser?.name}
              </Link>
              <Button variant="secondary" className="btn-sm" onClick={onLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">
                Вход
              </Link>
              <Link className="nav-link" to="/register">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
