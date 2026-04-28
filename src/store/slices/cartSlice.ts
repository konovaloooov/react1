import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, EntityId, Product } from '../../types/shop';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const item = state.items.find((cartItem) => cartItem.product.id === action.payload.id);

      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    increaseQuantity(state, action: PayloadAction<EntityId>) {
      const item = state.items.find((cartItem) => cartItem.product.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity(state, action: PayloadAction<EntityId>) {
      const item = state.items.find((cartItem) => cartItem.product.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((cartItem) => cartItem.product.id !== action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<EntityId>) {
      state.items = state.items.filter((cartItem) => cartItem.product.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
