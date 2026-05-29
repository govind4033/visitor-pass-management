import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// layout
import DashboardLayout from './components/layout/DashboardLayout';

// auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// shared pages
import Dashboard from './pages/shared/Dashboard';
import Visitors from './pages/shared/Visitors';
import Appointments from './pages/shared/Appointments';
import Passes from './pages/shared/Passes';
import CheckLogs from './pages/shared/CheckLogs';
import Profile from './pages/shared/Profile';

// admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateUser from './pages/admin/CreateUser';
import EditUser from './pages/admin/EditUser';
import Employees from './pages/admin/Employees';
import SecurityStaff from './pages/admin/SecurityStaff';
import ManageVisitors from './pages/admin/ManageVisitors';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

// employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ManageAppointments from './pages/employee/ManageAppointments';
import MyVisitors from './pages/employee/MyVisitors';

// security pages
import SecurityDashboard from './pages/security/SecurityDashboard';
import CheckIn from './pages/security/CheckIn';
import CheckOut from './pages/security/CheckOut';
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

            {/* ================= SHARED ================= */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/passes" element={<Passes />} />
            <Route path="/check-logs" element={<CheckLogs />} />

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
              path="/checkin"
              element={
                <ProtectedRoute roles={['security']}>
                  <CheckIn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute roles={['security']}>
                  <CheckOut />
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