import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import NotVerified from './components/pages/NotVerified';
import Dashboard from './components/pages/Dashboard';
import NeeraForm from './components/pages/NeeraForm';
import NeeraList from './components/pages/NeeraList';
import ProcessingForm from './components/pages/ProcessingForm';
import ProcessingStageUpdate from './components/pages/ProcessingStageUpdate';
import InventoryForm from './components/pages/InventoryForm';
import InventoryList from './components/pages/InventoryList';
import ManagerPanel from './components/pages/ManagerPanel';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="px-4 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/not-verified" element={<NotVerified />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/neera" element={<NeeraForm />} />
          <Route path="/neera/list" element={<NeeraList />} />
          <Route path="/processing/create" element={<ProcessingForm />} />
          <Route path="/processing/update" element={<ProcessingStageUpdate />} />
          <Route path="/inventory" element={<ProtectedRoute role="manager"><InventoryForm /></ProtectedRoute>} />
          <Route path="/inventory/list" element={<ProtectedRoute role="manager"><InventoryList /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute role="manager"><ManagerPanel /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}
