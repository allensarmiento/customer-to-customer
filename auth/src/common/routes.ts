const API_ROUTE = '/api';

const AUTH_ROUTE = `${API_ROUTE}/auth`;

export const Routes = {
  currentUser: `${AUTH_ROUTE}/currentuser`,
  signup: `${AUTH_ROUTE}/signup`,
  signin: `${AUTH_ROUTE}/signin`,
  signout: `${AUTH_ROUTE}/signout`,
};
