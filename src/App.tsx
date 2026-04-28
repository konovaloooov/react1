import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { AdminPage } from './pages/AdminPage';
import { CartPage } from './pages/CartPage';
import { CatalogPage } from './pages/CatalogPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { store } from './store';
import { fetchProducts } from './store/slices/productsSlice';
import { AuthWrapper } from './wrappers/AuthWrapper';
import { CommonWrapper } from './wrappers/CommonWrapper';

function App() { 
  useEffect(() => {
    const productStatus = store.getState().products.status;

    if (productStatus === 'idle') {
      store.dispatch(fetchProducts());
    }
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <CommonWrapper>
          <AuthWrapper>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthWrapper>
        </CommonWrapper>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
