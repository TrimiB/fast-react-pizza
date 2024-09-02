import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/user/userSlice';
import cartReducer from './features/cart/cartSlice';

/**
 * Configures and exports the Redux store for the application.
 * The store is configured with two reducers:
 * - `userReducer` from the `userSlice` module
 * - `cartReducer` from the `cartSlice` module
 *
 * This store can be imported and used throughout the application to access and update the global state.
 */
const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
});

export default store;
