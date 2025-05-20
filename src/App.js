import './App.css';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import CategoryPage from './CategoryPage';
import Inventory from './Inventory';
import OrdersManagement from './InventoryPage';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<OrdersManagement />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
