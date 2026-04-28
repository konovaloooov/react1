import { useEffect, useRef, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { addToCart } from '../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { Product } from '../types/shop';

export function CatalogPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const [cartMessage, setCartMessage] = useState('');
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    setCartMessage(`“${product.name}” добавлен в корзину`);

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    messageTimeoutRef.current = setTimeout(() => {
      setCartMessage('');
    }, 2500);
  };

  return (
    <section className="page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="mb-1">Каталог</h1>
          <p className="text-muted mb-0">Ассортимент свежих десертов.</p>
        </div>
        <span className="badge text-bg-secondary">Товаров: {products.length}</span>
      </div>

      {cartMessage && (
        <div className="alert alert-success" role="status">
          {cartMessage}
        </div>
      )}

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-md-6 col-lg-4" key={product.id}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </div>
        ))}
      </div>
    </section>
  );
}
