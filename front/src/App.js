import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginUser from './components/LoginUser';
import LoginAdmin from './components/LoginAdmin';
import Produtos from './components/Produtos';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/produtos" /> : <LoginUser setUser={setUser} />} />
        <Route path="/produtos" element={user ? <Produtos user={user} /> : <Navigate to="/" />} />
        <Route path="/admin/login" element={admin ? <Navigate to="/admin" /> : <LoginAdmin setAdmin={setAdmin} />} />
        <Route path="/admin" element={admin ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
