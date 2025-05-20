import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Компонент для защищённого маршрута
const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;