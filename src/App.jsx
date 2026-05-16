import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import LandingPage   from './pages/LandingPage';
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import TermsPage     from './pages/TermsPage';
import PrivacyPage   from './pages/PrivacyPage';
import Dashboard     from './pages/Dashboard';
import PantryPage    from './pages/PantryPage';
import AddItemPage   from './pages/AddItemPage';
import EditItemPage  from './pages/EditItemPage';
import AlertsPage    from './pages/AlertsPage';
import ReportsPage   from './pages/ReportsPage';
import SettingsPage  from './pages/SettingsPage';
import RecipesPage   from './pages/RecipesPage';
import GroceryPage   from './pages/GroceryPage';
import NotFoundPage  from './pages/NotFoundPage';

// Protected Route wrapper
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'DM Sans, sans-serif',
            borderRadius: '12px',
            fontSize: '14px',
            padding: '12px 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login"            element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"         element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password"  element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/terms"            element={<TermsPage />} />
          <Route path="/privacy"          element={<PrivacyPage />} />

          {/* Protected — inside Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard"     element={<Dashboard />} />
              <Route path="/pantry"        element={<PantryPage />} />
              <Route path="/add-item"      element={<AddItemPage />} />
              <Route path="/edit-item/:id" element={<EditItemPage />} />
              <Route path="/alerts"        element={<AlertsPage />} />
              <Route path="/recipes"       element={<RecipesPage />} />
              <Route path="/reports"       element={<ReportsPage />} />
              <Route path="/grocery"       element={<GroceryPage />} />
              <Route path="/settings"      element={<SettingsPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
