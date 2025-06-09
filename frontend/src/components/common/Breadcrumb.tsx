import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/20/solid';

interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Início</span>
            </Link>
          </div>
        </li>
        {items.map((item) => (
          <li key={item.name}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              {item.href ? (
                <Link
                  to={item.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ) : (
                <span 
                  className="ml-4 text-sm font-medium text-gray-400"
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
