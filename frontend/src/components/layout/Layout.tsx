import { Fragment } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', current: location.pathname === '/' },
    { name: 'Famílias', href: '/familias', current: location.pathname.startsWith('/familias') },
    { name: 'Membros', href: '/membros', current: location.pathname.startsWith('/membros') },
    { name: 'Turmas', href: '/turmas', current: location.pathname.startsWith('/turmas') },
    { name: 'Presenças', href: '/presencas', current: location.pathname.startsWith('/presencas') },
    { name: 'Cestas', href: '/cestas', current: location.pathname.startsWith('/cestas') },
    { name: 'Relatórios', href: '/relatorios', current: location.pathname.startsWith('/relatorios') },
  ];

  const userNavigation = [
    { name: 'Seu perfil', href: '#' },
    { name: 'Configurações', href: '#' },
    { name: 'Sair', onClick: logout },
  ];

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-primary-600">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link to="/">
                      <span className="text-white font-bold text-xl">SAS</span>
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-primary-700 text-white'
                              : 'text-white hover:bg-primary-500 hover:bg-opacity-75',
                            'px-3 py-2 rounded-md text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex max-w-xs items-center rounded-full bg-primary-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
                          <span className="sr-only">Abrir menu do usuário</span>
                          <div className="h-8 w-8 rounded-full bg-primary-400 flex items-center justify-center text-white font-medium">
                            {user?.nome.charAt(0).toUpperCase()}
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <button
                                  onClick={item.onClick}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block w-full text-left px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-primary-600 p-2 text-white hover:bg-primary-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
                    <span className="sr-only">Abrir menu principal</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-primary-700 text-white'
                        : 'text-white hover:bg-primary-500 hover:bg-opacity-75',
                      'block px-3 py-2 rounded-md text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-primary-700 pt-4 pb-3">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-400 flex items-center justify-center text-white font-medium">
                      {user?.nome.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user?.nome}</div>
                    <div className="text-sm font-medium text-primary-200">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={item.onClick ? 'button' : Link}
                      to={!item.onClick ? item.href : undefined}
                      onClick={item.onClick}
                      className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-500 hover:bg-opacity-75"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
