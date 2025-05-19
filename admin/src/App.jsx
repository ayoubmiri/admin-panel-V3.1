import React from 'react';
import { Routes, Route } from 'react-router-dom';  // <-- no BrowserRouter here
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';

import Dashboard from './components/Dashboard/Dashboard';
import Students from './components/Students/Students';
import Teachers from './components/Teachers/Teachers';
import Announcements from './components/Announcements/Announcements';
import Courses from './components/Courses/Courses';
import Schedule from './components/Schedule/Schedule';
import Grades from './components/Grades/Grades';
import Settings from './components/Settings/Settings';

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute requiredRoles={['admin']} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
