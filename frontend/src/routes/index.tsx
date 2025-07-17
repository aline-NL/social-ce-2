import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';

// Páginas com lazy loading
const Login = lazy(() => import('../pages/auth/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const FamiliasList = lazy(() => import('../pages/familias/FamiliasList'));
const FamiliaForm = lazy(() => import('../pages/familias/FamiliaForm'));
const FamiliaDetail = lazy(() => import('../pages/familias/FamiliaDetail'));
const MembrosList = lazy(() => import('../pages/membros/MembrosList'));
const MembroForm = lazy(() => import('../pages/membros/MembroForm'));
const TurmasList = lazy(() => import('../pages/turmas/TurmasList'));
const TurmaForm = lazy(() => import('../pages/turmas/TurmaForm'));
const PresencasList = lazy(() => import('../pages/presencas/PresencasList'));
const CestasList = lazy(() => import('../pages/cestas/CestasList'));
const Relatorios = lazy(() => import('../pages/relatorios/Relatorios'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Componente de loading para o Suspense
const Loading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
  >
    <CircularProgress />
  </Box>
);

// Componente para rotas protegidas
const ProtectedRoute = ({
  children,
  requiredRole = 'visualizador',
}: {
  children?: React.ReactNode;
  requiredRole?: 'admin' | 'atendente' | 'visualizador';
}) => {
  const { isAuthenticated, user } = useAuth();
  const roleHierarchy = {
    admin: 3,
    atendente: 2,
    visualizador: 1,
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && roleHierarchy[user.tipo] < roleHierarchy[requiredRole]) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

// Componente de rotas da aplicação
const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<div>Não autorizado</div>} />

        {/* Rotas protegidas */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          
          {/* Rotas de Famílias */}
          <Route path="familias">
            <Route index element={<FamiliasList />} />
            <Route
              path="nova"
              element={
                <ProtectedRoute requiredRole="atendente">
                  <FamiliaForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="editar/:id"
              element={
                <ProtectedRoute requiredRole="atendente">
                  <FamiliaForm />
                </ProtectedRoute>
              }
            />
            <Route path=":id" element={<FamiliaDetail />} />
          </Route>

          {/* Rotas de Membros */}
          <Route path="membros">
            <Route index element={<MembrosList />} />
            <Route
              path="novo"
              element={
                <ProtectedRoute requiredRole="atendente">
                  <MembroForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="editar/:id"
              element={
                <ProtectedRoute requiredRole="atendente">
                  <MembroForm />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Rotas de Turmas */}
          <Route path="turmas">
            <Route index element={<TurmasList />} />
            <Route
              path="nova"
              element={
                <ProtectedRoute requiredRole="atendente">
                  <TurmaForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="editar/:id"
              element={
                <ProtectedRoute requiredRole="atendente">
                  <TurmaForm />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Outras rotas */}
          <Route path="presencas" element={<PresencasList />} />
          <Route path="cestas" element={<CestasList />} />
          
          <Route
            path="relatorios"
            element={
              <ProtectedRoute requiredRole="admin">
                <Relatorios />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Rota 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
