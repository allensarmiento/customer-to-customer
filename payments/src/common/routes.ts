const API_ROUTE = '/api';

const AUTH_ROUTE = `${API_ROUTE}/auth`;
const ITEMS_ROUTE = `${API_ROUTE}/items`;
const ORDERS_ROUTE = `${API_ROUTE}/orders`;
const PAYMENTS_ROUTE = `${API_ROUTE}/payments`;

export const Routes = {
  currentUser: `${AUTH_ROUTE}/currentuser`,
  signup: `${AUTH_ROUTE}/signup`,
  signin: `${AUTH_ROUTE}/signin`,
  signout: `${AUTH_ROUTE}/signout`,

  items: ITEMS_ROUTE,

  orders: ORDERS_ROUTE,

  payments: PAYMENTS_ROUTE,
};
