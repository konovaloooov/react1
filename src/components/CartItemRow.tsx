import { CartItem, EntityId } from '../types/shop';
import { Button } from '../ui/Button';
import { formatPrice } from '../utils/formatPrice';

interface CartItemRowProps {
  item: CartItem;
  onDecrease: (productId: EntityId) => void;
  onIncrease: (productId: EntityId) => void;
  onRemove: (productId: EntityId) => void;
}

export function CartItemRow({ item, onDecrease, onIncrease, onRemove }: CartItemRowProps) {
  return (
    <div className="card">
      <div className="card-body cart-row">
        <strong>{item.product.name}</strong>
        <Button variant="secondary" className="btn-sm" onClick={() => onDecrease(item.product.id)}>
          -
        </Button>
        <span className="fw-bold text-center">{item.quantity}</span>
        <Button variant="secondary" className="btn-sm" onClick={() => onIncrease(item.product.id)}>
          +
        </Button>
        <span>{formatPrice(item.product.price * item.quantity)}</span>
        <Button variant="danger" className="btn-sm" onClick={() => onRemove(item.product.id)}>
          Удалить
        </Button>
      </div>
    </div>
  );
}
