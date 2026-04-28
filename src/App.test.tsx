import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';

test('renders landing page', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>,
  );
  const titleElement = screen.getByText(/интернет-магазин кондитерских изделий/i);
  expect(titleElement).toBeInTheDocument();
});
