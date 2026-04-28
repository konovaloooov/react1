import { Product } from '../types/shop';
import { Button } from '../ui/Button';
import { formatPrice } from '../utils/formatPrice';
import { StatusBadge } from './StatusBadge';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="card catalog-card">
      <img src={product.image} alt={product.name} />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h3 className="h5">{product.name}</h3>
          <StatusBadge isActive={product.inStock} />
        </div>
        <p className="text-muted flex-grow-1">{product.description}</p>
        <div className="d-flex justify-content-between text-muted small mb-3">
          <span>{product.weight}</span>
          <span>★ {product.rating}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center gap-3">
          <span className="price">{formatPrice(product.price)}</span>
          <Button disabled={!product.inStock} onClick={() => onAddToCart(product)}>
            В корзину
          </Button>
        </div>
      </div>
    </article>
  );
}
