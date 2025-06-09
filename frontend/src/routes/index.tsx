import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { Dashboard } from '../pages/Dashboard';
import { FamiliesList, FamilyForm } from '../pages/families';
import { MembersList, MemberForm } from '../pages/members';
import { DeliveriesList, DeliveryForm } from '../pages/deliveries';
import { ClassesList, ClassForm, ClassAttendance } from '../pages/classes';
import { Reports } from '../pages/reports';
import { Login } from '../pages/auth';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      
      // Families routes
      { path: 'families', element: <FamiliesList /> },
      { path: 'families/new', element: <FamilyForm /> },
      { path: 'families/:id/edit', element: <FamilyForm /> },
      
      // Members routes
      { path: 'members', element: <MembersList /> },
      { path: 'members/new', element: <MemberForm /> },
      { path: 'members/:id/edit', element: <MemberForm /> },
      
      // Deliveries routes
      { path: 'deliveries', element: <DeliveriesList /> },
      { path: 'deliveries/new', element: <DeliveryForm /> },
      
      // Classes routes
      { path: 'classes', element: <ClassesList /> },
      { path: 'classes/new', element: <ClassForm /> },
      { path: 'classes/:id/attendance', element: <ClassAttendance /> },
      
      // Reports
      { path: 'reports', element: <Reports /> },
    ],
  },
]);
