import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { login } from '../store/slices/userSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('student@mail.ru');
  const [password, setPassword] = useState('123456');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = await dispatch(login({ email: email.trim(), password: password.trim() }));

    if (user) {
      const fromState = (location.state as { from?: string } | null)?.from;
      const fromQuery = new URLSearchParams(location.search).get('from');

      navigate(fromState || fromQuery || '/dashboard');
    }
  };

  return (
    <section className="page small-page">
      <h1>Авторизация</h1>
      <p className="text-muted mb-1">Пользователь: student@mail.ru / 123456</p>
      <p className="text-muted">Админ: admin@mail.ru / admin123</p>
      <form className="vstack gap-3" onSubmit={handleSubmit}>
        <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button className="w-100" type="submit">Войти</Button>
      </form>
    </section>
  );
}
