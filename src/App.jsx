import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReportIncident from './pages/ReportIncident';
import Incidents from './pages/Incidents';
import AdminPanel from './pages/AdminPanel';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/report"
            element={
              <ProtectedRoute allowedRoles={['operator', 'volunteer']}>
                <ReportIncident />
              </ProtectedRoute>
            }
          />
          <Route path="/incidents" element={<Incidents />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['operator']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
