import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import RoleBasedDashboard from './components/RoleBasedDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CommunicationPreferencesManagement from './components/CommunicationPreferencesManagement';
import DataSubjectRightsPortal from './components/DataSubjectRightsPortal';
import PrivacyNoticeManagement from './components/PrivacyNoticeManagement';
import EnhancedConsentManagement from './components/EnhancedConsentManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/communication-preferences" element={<CommunicationPreferencesManagement />} />
          <Route path="/dsar-portal" element={<DataSubjectRightsPortal />} />
          <Route path="/privacy-notice" element={<PrivacyNoticeManagement />} />
          <Route path="/enhanced-consent" element={<EnhancedConsentManagement />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;