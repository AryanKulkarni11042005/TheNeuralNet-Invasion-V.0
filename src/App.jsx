import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReportIncident from './pages/ReportIncident';
import Incidents from './pages/Incidents';
import AdminPanel from './pages/AdminPanel';
import VolunteerReview from './pages/VolunteerReview';
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
              <ProtectedRoute allowedRoles={['operator', 'volunteer', 'viewer']}>
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
          <Route
            path="/review"
            element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <VolunteerReview />
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
