import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// layout
import DashboardLayout from './components/layout/DashboardLayout';

// pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import NewVisitor from './pages/NewVisitor';
import Appointments from './pages/Appointments';
import CheckIn from './pages/CheckIn';
import Reports from './pages/Reports';
import Passes from './pages/Passes';
import PassView from './components/PassView';
import EditVisitor from './pages/EditVisitor';

export default function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* DASHBOARD LAYOUT + PROTECTED ROUTES */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >

            {/* dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* appointments */}
            <Route path="/appointments" element={<Appointments />} />

            {/* pass view */}
            <Route path="/passes" element={<Passes />} />
            <Route path="/passes/:id" element={<PassView />} />

            {/* visitors */}
            <Route
              path="/visitors"
              element={
                <ProtectedRoute roles={['admin', 'security']}>
                  <Visitors />
                </ProtectedRoute>
              }
            />

            {/* new visitor */}
            <Route
              path="/visitors/new"
              element={
                <ProtectedRoute
                  roles={['admin', 'security', 'employee']}
                >
                  <NewVisitor />
                </ProtectedRoute>
              }
            />

            {/* edit visitor */}
            <Route
              path="/visitors/edit/:id"
              element={
                <ProtectedRoute
                  roles={['admin', 'security', 'employee']}
                >
                  <EditVisitor />
                </ProtectedRoute>
              }
            />

            {/* check-in */}
            <Route
              path="/checkin"
              element={
                <ProtectedRoute roles={['admin', 'security']}>
                  <CheckIn />
                </ProtectedRoute>
              }
            />

            {/* reports */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              }
            />

          </Route>

        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}