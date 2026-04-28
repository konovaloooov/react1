import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { register } from '../store/slices/userSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = await dispatch(register({ name, email, phone, password }));

    if (user) {
      navigate('/dashboard');
    }
  };

  return (
    <section className="page small-page">
      <h1>Регистрация</h1>
      <form className="vstack gap-3" onSubmit={handleSubmit}>
        <Input label="Имя" value={name} onChange={(event) => setName(event.target.value)} required />
        <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input label="Телефон" value={phone} onChange={(event) => setPhone(event.target.value)} required />
        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button className="w-100" type="submit">Зарегистрироваться</Button>
      </form>
    </section>
  );
}
