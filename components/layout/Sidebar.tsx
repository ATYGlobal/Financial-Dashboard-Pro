'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',   icon: '📊' },
  { href: '/incomes',    label: 'Ingresos',     icon: '💰' },
  { href: '/expenses',   label: 'Gastos',       icon: '💸' },
  { href: '/forecast',   label: 'Forecast',     icon: '📈' },
  { href: '/scenarios',  label: 'Escenarios',   icon: '🔀' },
  { href: '/history',    label: 'Histórico',    icon: '📅' },
  { href: '/settings',   label: 'Configuración',icon: '⚙️' },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-gray-200 bg-white min-h-screen shrink-0">
      <div className="px-6 py-5 border-b border-gray-200">
        <span className="font-bold text-blue-700 text-lg">FinPRO</span>
      </div>
      <nav className="flex-1 py-4">
        {NAV.map(n => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
              path.startsWith(n.href)
                ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}