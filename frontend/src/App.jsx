import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';


// pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import NewVisitor from './pages/NewVisitor';
import Appointments from './pages/Appointments';
import PassView from './pages/PassView';
import CheckIn from './pages/CheckIn';

export default function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>

          {/* public routes */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />


          {/* protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />


          <Route
            path="/passes/:id"
            element={
              <ProtectedRoute>
                <PassView />
              </ProtectedRoute>
            }
          />


          {/* admin + security */}
          <Route
            path="/visitors"
            element={
              <ProtectedRoute roles={['admin', 'security']}>
                <Visitors />
              </ProtectedRoute>
            }
          />


          {/* all roles */}
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


          <Route
            path="/checkin"
            element={
              <ProtectedRoute roles={['admin', 'security']}>
                <CheckIn />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}