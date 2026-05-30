import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// layout
import DashboardLayout from './components/layout/DashboardLayout';

// auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import SecurityStaff from './pages/admin/SecurityStaff';
import ManageVisitors from './pages/admin/ManageVisitors';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import CreateUser from './pages/admin/CreateUser';
import EditUser from './pages/admin/EditUser';

// employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ManageAppointments from './pages/employee/ManageAppointments';
import MyVisitors from './pages/employee/MyVisitors';

// security pages
import SecurityDashboard from './pages/security/SecurityDashboard';
import VerifyAppointments from './pages/security/VerifyAppointment';
import Passes from './pages/security/Passes';
import CheckIn from './pages/security/CheckIn';
import Logs from './pages/security/Logs';

// visitor pages
import VisitorDashboard from './pages/visitor/VisitorDashboard';
import BookAppointment from './pages/visitor/BookAppointment';
import MyAppointments from './pages/visitor/MyAppointments';
import MyPass from './pages/visitor/MyPass';

export default function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>

          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* PROTECTED LAYOUT */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >

            {/* ================= ADMIN ================= */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/security-staff"
              element={
                <ProtectedRoute roles={['admin']}>
                  <SecurityStaff />
                </ProtectedRoute>
              }
            /> 
            <Route
              path="/ManageVisitors"
              element={
                <ProtectedRoute roles={['admin']}>
                  <ManageVisitors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/new"
              element={
                <ProtectedRoute roles={['admin']}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/edit/:id"
              element={
                <ProtectedRoute roles={['admin']}>
                  <EditUser />
                </ProtectedRoute>
              }
            />

            {/* ================= EMPLOYEE ================= */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute roles={['employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-appointments"
              element={
                <ProtectedRoute roles={['employee']}>
                  <ManageAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-visitors"
              element={
                <ProtectedRoute roles={['employee']}>
                  <MyVisitors />
                </ProtectedRoute>
              }
            />

            {/* ================= SECURITY ================= */}
            <Route
              path="/security"
              element={
                <ProtectedRoute roles={['security']}>
                  <SecurityDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-appointments"
              element={
                <ProtectedRoute roles={['security']}>
                  <VerifyAppointments />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/passes" 
              element={
                <ProtectedRoute roles={['security']}>
                  <Passes />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/checkin"
              element={
                <ProtectedRoute roles={['security']}>
                  <CheckIn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <ProtectedRoute roles={['security']}>
                  <Logs />
                </ProtectedRoute>
              }
            />

            {/* ================= VISITOR ================= */}
            <Route
              path="/visitor"
              element={
                <ProtectedRoute roles={['visitor']}>
                  <VisitorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute roles={['visitor']}>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute roles={['visitor']}>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-pass"
              element={
                <ProtectedRoute roles={['visitor']}>
                  <MyPass />
                </ProtectedRoute>
              }
            />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}