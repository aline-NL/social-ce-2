import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Loader2 } from 'lucide-react';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import FamiliasList from './pages/familias/FamiliasList';
import FamiliaForm from './pages/familias/FamiliaForm';
import FamiliaDetail from './pages/familias/FamiliaDetail';
import MembrosList from './pages/membros/MembrosList.tsx';
import TurmasList from './pages/turmas/TurmasList';
import PresencasList from './pages/presencas/PresencasList';
import CestasList from './pages/cestas/CestasList';
import Relatorios from './pages/relatorios/Relatorios';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route Component
type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'atendente' | 'visualizador';
};

const ProtectedRoute = ({ children, requiredRole = 'visualizador' }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const roleHierarchy = {
    admin: 3,
    atendente: 2,
    visualizador: 1
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && roleHierarchy[user.tipo] < roleHierarchy[requiredRole]) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  
  // Close sidebar when navigating on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
              <Sidebar />
            </div>
            
            <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              
              <main className="flex-1">
                <div className="py-6">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<Login />} />
                      
                      {/* Protected Routes */}
                      <Route 
                        path="/" 
                        element={
                          <ProtectedRoute>
                            <Outlet />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<Dashboard />} />
                        
                        {/* Famílias */}
                        <Route path="familias">
                          <Route index element={<FamiliasList />} />
                          <Route path="nova" element={<FamiliaForm />} />
                          <Route path=":id" element={<FamiliaDetail />} />
                          <Route path=":id/editar" element={<FamiliaForm />} />
                        </Route>
                        <Route path="/familias" element={<FamiliasList />} />
                        <Route path="/familias/nova" element={<FamiliaForm />} />
                        <Route path="/familias/editar/:id" element={<FamiliaForm />} />
                        <Route path="/familias/:id" element={<FamiliaDetail />} />
                        
                        
                        {/* Membros */}
                        <Route path="membros" element={<MembrosList />} />
                        <Route path="/membros/novo" element={<MembroForm />} />
                        <Route path="/membros/editar/:id" element={<MembroForm />} />
                        <Route path="/membros/:id" element={<MembroDetail />} />
                        
                        {/* Turmas */}
                        <Route path="turmas" element={<TurmasList />} />
                        <Route path="/turmas/nova" element={<TurmaForm />} />
                        <Route path="/turmas/editar/:id" element={<TurmaForm />} />
                        
                        {/* Presenças */}
                        <Route path="presencas" element={<PresencasList />} />
                        
                        {/* Cestas */}
                        <Route path="cestas" element={<CestasList />} />
                        
                        {/* Relatórios */}
                        <Route 
                          path="relatorios" 
                          element={
                            <ProtectedRoute requiredRole="atendente">
                              <Relatorios />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </div>
                </div>
              </main>
            </div>
          </div>
          
          {/* Toast Notifications */}
          <Toaster position="top-right" />
          
          {/* React Query DevTools */}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
