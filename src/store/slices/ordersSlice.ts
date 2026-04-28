import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createOrder, getOrders } from '../../api/shopApi';
import type { AppThunk } from '..';
import { Order, OrderForm } from '../../types/shop';
import { showError } from './errorSlice';
import { setLoading } from './loadingSlice';

interface OrdersState {
  items: Order[];
}

const initialState: OrdersState = {
  items: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.items = action.payload;
    },
    addOrderToState(state, action: PayloadAction<Order>) {
      state.items.push(action.payload);
    },
  },
});

const { setOrders, addOrderToState } = ordersSlice.actions;

export const fetchOrders = (): AppThunk<Promise<void>> => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const orders = await getOrders();
    dispatch(setOrders(orders));
  } catch {
    dispatch(showError('Не удалось загрузить заказы'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const submitOrder = (form: OrderForm): AppThunk<Promise<Order | null>> => async (dispatch, getState) => {
  const state = getState();

  if (state.cart.items.length === 0) {
    dispatch(showError('Корзина пустая'));
    return null;
  }

  const order = {
    ...form,
    items: state.cart.items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    })),
    total: state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  };

  try {
    dispatch(setLoading(true));
    const createdOrder = await createOrder(order);
    dispatch(addOrderToState(createdOrder));
    return createdOrder;
  } catch {
    dispatch(showError('Не удалось оформить заказ'));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export default ordersSlice.reducer;
