import { useAppSelector } from '../hooks/redux';

export function ProfilePage() {
  const user = useAppSelector((state) => state.user.currentUser);

  return (
    <section className="page">
      <h1>Личный кабинет</h1>
      <p className="text-muted">Данные пользователя после авторизации:</p>
      <div className="card">
        <div className="card-body">
          <dl className="row mb-0">
            <dt className="col-sm-3">Имя</dt>
            <dd className="col-sm-9">{user?.name}</dd>
            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9">{user?.email}</dd>
            <dt className="col-sm-3">Телефон</dt>
            <dd className="col-sm-9">{user?.phone}</dd>
            <dt className="col-sm-3">Роль</dt>
            <dd className="col-sm-9">{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
