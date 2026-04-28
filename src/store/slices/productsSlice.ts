import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createProduct, deleteProduct, getProducts, replaceProduct, updateProduct } from '../../api/shopApi';
import type { AppThunk } from '..';
import { EntityId, Product, ProductFormData } from '../../types/shop';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { showError } from './errorSlice';
import { setLoading } from './loadingSlice';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'success';
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
      state.status = 'success';
    },
    addProductToState(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
    },
    updateProductInState(state, action: PayloadAction<Product>) {
      state.items = state.items.map((product) => (product.id === action.payload.id ? action.payload : product));
    },
    removeProductFromState(state, action: PayloadAction<EntityId>) {
      state.items = state.items.filter((product) => product.id !== action.payload);
    },
  },
});

const { setProducts, addProductToState, updateProductInState, removeProductFromState } = productsSlice.actions;

export const fetchProducts = (): AppThunk<Promise<void>> => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const products = await getProducts();
    dispatch(setProducts(products));
  } catch {
    dispatch(showError('Не удалось загрузить товары. Запустите backend.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addProduct = (product: ProductFormData): AppThunk<Promise<Product | null>> => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const createdProduct = await createProduct(product);
    dispatch(addProductToState(createdProduct));
    return createdProduct;
  } catch (error) {
    dispatch(showError(getErrorMessage(error, 'Не удалось добавить товар')));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export const editProduct = (product: Product): AppThunk<Promise<Product | null>> => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const updatedProduct = await replaceProduct(product);
    dispatch(updateProductInState(updatedProduct));
    return updatedProduct;
  } catch {
    dispatch(showError('Не удалось заменить товар'));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export const toggleProductAvailability = (product: Product): AppThunk<Promise<Product | null>> => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const updatedProduct = await updateProduct(product.id, { inStock: !product.inStock });
    dispatch(updateProductInState(updatedProduct));
    return updatedProduct;
  } catch {
    dispatch(showError('Не удалось обновить товар'));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeProduct = (id: EntityId): AppThunk<Promise<EntityId | null>> => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const removedProductId = await deleteProduct(id);
    dispatch(removeProductFromState(removedProductId));
    return removedProductId;
  } catch {
    dispatch(showError('Не удалось удалить товар'));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export default productsSlice.reducer;
