import React from 'react';
import { Routes, Route } from 'react-router-dom';  // <-- no BrowserRouter here
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Students from './components/Students/Students';
import StudentList from './components/Students/StudentList';
import StudentForm from './components/Students/StudentForm';
import Teachers from './components/Teachers/Teachers';
import TeacherList from './components/Teachers/TeacherList';
import TeacherForm from './components/Teachers/TeacherForm';
import Announcements from './components/Announcements/Announcements';
import AnnouncementList  from './components/Announcements/AnnouncementList';
import AnnouncementForm from './components/Announcements/AnnouncementForm';
import Courses from './components/Courses/Courses';
import Schedule from './components/Schedule/Schedule';
import Grades from './components/Grades/Grades';
import Settings from './components/Settings/Settings';
import Filiere from './components/Filiere/Filiere';
import Module from './components/Module/Module';
import Element from './components/Element/Element';
import Class from './components/Class/Class';
import Controls from './components/Controls/Controls';
import Exams from './components/Exams/Exams';
import Assignments from './components/Assignments/Assignments';

function App() {
 return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute requiredRoles={['admin']} />}>
        {/* Layout wraps all protected routes */}
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="filiere" element={<Filiere />} />
          <Route path="module" element={<Module />} />
          <Route path="element" element={<Element />} />
          <Route path="class" element={<Class />} />
          <Route path="controls" element={<Controls />} />
          <Route path="exams" element={<Exams />} />
          <Route path="assignments" element={<Assignments />} />

          <Route path="courses" element={<Courses />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="grades" element={<Grades />} />
          <Route path="settings" element={<Settings />} />

          {/* nestedRoutes */}
          <Route path="announcements/list" element={<AnnouncementList />} />
          <Route path="announcements/new" element={<AnnouncementForm />} />

          <Route path="teachers/list" element={<TeacherList />} />
          <Route path="teachers/new" element={<TeacherForm />} />
          
          <Route path="students/list" element={<StudentList />} />
          <Route path="students/new" element={<StudentForm />} />

          

        </Route>
      </Route>
    </Routes>
  );
}

export default App;
