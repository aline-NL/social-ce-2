import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  UserGroupIcon, 
  UserIcon, 
  GiftIcon, 
  CalendarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { familiasApi, membrosApi, cestasApi } from '../services/api';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  iconColor: string;
  link?: string;
}

function StatsCard({ title, value, icon: Icon, iconColor, link }: StatsCardProps) {
  const content = (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${iconColor}`}>
            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return link ? (
    <Link to={link} className="block hover:opacity-90 transition-opacity">
      {content}
    </Link>
  ) : (
    content
  );
}

export default function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch data using React Query
  const { 
    data: familiasData, 
    isLoading: isLoadingFamilias,
    error: familiasError 
  } = useQuery(['familias'], () => familiasApi.list());

  const { 
    data: membrosData, 
    isLoading: isLoadingMembros,
    error: membrosError 
  } = useQuery(['membros'], () => membrosApi.list());

  const { 
    data: cestasData, 
    isLoading: isLoadingCestas,
    error: cestasError 
  } = useQuery(['cestas'], () => 
    cestasApi.list({ 
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear()
    })
  );

  // Update last updated timestamp when data is loaded
  useEffect(() => {
    if (!isLoadingFamilias && !isLoadingMembros && !isLoadingCestas) {
      setLastUpdated(new Date());
    }
  }, [isLoadingFamilias, isLoadingMembros, isLoadingCestas]);

  // Calculate stats
  const totalFamilias = familiasData?.data?.length || 0;
  const totalMembros = membrosData?.data?.length || 0;
  const cestasEntregues = cestasData?.data?.length || 0;
  
  // Calculate families receiving social programs
  const familiasComProgramas = familiasData?.data?.filter(
    (familia: any) => familia.recebe_programas_sociais
  ).length || 0;

  // Quick actions
  const quickActions = [
    {
      name: 'Registrar Presença',
      href: '/presencas/registrar',
      icon: CalendarIcon,
      iconColor: 'bg-yellow-500',
      description: 'Registre a presença dos membros em encontros',
    },
    {
      name: 'Registrar Entrega de Cesta',
      href: '/cestas/registrar',
      icon: GiftIcon,
      iconColor: 'bg-green-500',
      description: 'Registre a entrega de cestas básicas',
    },
    {
      name: 'Cadastrar Nova Família',
      href: '/familias/nova',
      icon: UserGroupIcon,
      iconColor: 'bg-blue-500',
      description: 'Adicione uma nova família ao sistema',
    },
  ];

  // Show loading state
  if (isLoadingFamilias || isLoadingMembros || isLoadingCestas) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-600">Carregando dados...</span>
      </div>
    );
  }

  // Show error state
  if (familiasError || membrosError || cestasError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar os dados do dashboard
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Tente recarregar a página ou entre em contato com o suporte.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Visão Geral</h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Atualizado em {lastUpdated.toLocaleTimeString()}
              <button
                onClick={() => window.location.reload()}
                className="ml-2 text-primary-600 hover:text-primary-800"
              >
                <ArrowPathIcon className="h-4 w-4 inline" />
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Famílias"
          value={totalFamilias}
          icon={UserGroupIcon}
          iconColor="bg-primary-500"
          link="/familias"
        />
        <StatsCard
          title="Total de Membros"
          value={totalMembros}
          icon={UserIcon}
          iconColor="bg-indigo-500"
          link="/membros"
        />
        <StatsCard
          title="Cestas Entregues (Mês)"
          value={cestasEntregues}
          icon={GiftIcon}
          iconColor="bg-green-500"
          link="/cestas"
        />
        <StatsCard
          title="Famílias com Programas Sociais"
          value={familiasComProgramas}
          icon={UserGroupIcon}
          iconColor="bg-yellow-500"
          link="/familias?filter=com_programas"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${action.iconColor}`}>
                    <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="mt-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Atividades Recentes</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            <li className="px-4 py-4">
              <div className="text-sm text-gray-500 text-center">
                Em breve: Atividades recentes serão exibidas aqui
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
