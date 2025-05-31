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
import Filieres from './components/Filiere/Filieres';
import FiliereList from './components/Filiere/FiliereList';
import FiliereForm from './components/Filiere/FiliereForm';
import Classes from './components/Classes/Classes';
import ClassList from './components/Classes/ClassList';
import ClassForm from './components/Classes/ClassForm';
import Modules from './components/Modules/Modules';
import ModuleForm from './components/Modules/ModuleForm';
import ModuleList from './components/Modules/ModuleList';
import Element from './components/Elements/Element';
import Controls from './components/Controls/Controls';
import Exams from './components/Exams/Exams';
import Assignments from './components/Assignments/Assignments';
import ElementForm from './components/Elements/ElementForm';

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
          <Route path="filieres" element={<Filieres />} />
          <Route path="modules" element={<Modules />} />
          <Route path="elements" element={<Element />} />
          <Route path="classes" element={<Classes />} />
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
          <Route path="announcements/:id" element={<AnnouncementForm />} />
          <Route path="announcements/edit/:id" element={<AnnouncementForm />} />

          <Route path="teachers/list" element={<TeacherList />} />
          <Route path="teachers/new" element={<TeacherForm />} />
          <Route path="teachers/:id" element={<TeacherForm />} />
          <Route path="teachers/edit/:id" element={<TeacherForm />} />

          <Route path="elements/list" element={<Element />} />
          <Route path="elements/new" element={<ElementForm />} />
          <Route path="elements/:id" element={<ElementForm />} />
          <Route path="elements/edit/:id" element={<ElementForm />} />
          
          <Route path="students/list" element={<StudentList />} />
          <Route path="students/new" element={<StudentForm />} />
          <Route path="students/:id" element={<StudentForm />} />
          <Route path="students/edit/:id" element={<StudentForm />} />

          <Route path="filieres/list" element={<FiliereList />} />
          <Route path="filieres/new" element={<FiliereForm />} />
          <Route path="filieres/:id" element={<FiliereForm />} />
          <Route path="filieres/edit/:id" element={<FiliereForm />} />

          <Route path="modules/list" element={<ModuleList />} />
          <Route path="modules/new" element={<ModuleForm />} />
          <Route path="modules/:id" element={<ModuleForm />} />
          <Route path="modules/edit/:id" element={<ModuleForm />} />

          <Route path="classes/list" element={<ClassList />} /> 
          <Route path="classes/new" element={<ClassForm />} />
          <Route path="classes/:id" element={<ClassForm />} />
          <Route path="classes/edit/:id" element={<ClassForm />} />

          {/* Catch-all route for 404 Not Found */}

          

        </Route>
      </Route>
    </Routes>
  );
}

export default App;
