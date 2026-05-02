'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/incomes',   label: 'Ingresos',  icon: '💰' },
  { href: '/expenses',  label: 'Gastos',    icon: '💸' },
  { href: '/forecast',  label: 'Forecast',  icon: '📈' },
  { href: '/history',   label: 'Histórico', icon: '📅' },
];

export default function MobileNav() {
  const path = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
      {NAV.map(n => (
        <Link
          key={n.href}
          href={n.href}
          className={`flex-1 flex flex-col items-center py-2 text-xs gap-0.5 transition-colors ${
            path.startsWith(n.href) ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <span className="text-lg">{n.icon}</span>
          {n.label}
        </Link>
      ))}
    </nav>
  );
}