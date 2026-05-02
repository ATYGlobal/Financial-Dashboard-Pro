type Variant =
  | 'default'
  | 'blue'
  | 'green'
  | 'red'
  | 'orange'
  | 'purple'
  | 'gray';

interface Props {
  label: string;
  variant?: Variant;
  size?: 'sm' | 'xs';
}

const variantMap: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-700',
  blue:    'bg-blue-100 text-blue-700',
  green:   'bg-emerald-100 text-emerald-700',
  red:     'bg-red-100 text-red-700',
  orange:  'bg-orange-100 text-orange-700',
  purple:  'bg-purple-100 text-purple-700',
  gray:    'bg-gray-100 text-gray-500',
};

export function categoryVariant(category: string): Variant {
  switch (category) {
    case 'Trabajo': return 'blue';
    case 'Ayuda':   return 'purple';
    case 'Extra':   return 'green';
    default:        return 'gray';
  }
}

export function priorityVariant(priority: string): Variant {
  switch (priority) {
    case 'Esencial':     return 'red';
    case 'Importante':   return 'orange';
    case 'Prescindible': return 'gray';
    default:             return 'default';
  }
}

export function statusVariant(status: string): Variant {
  switch (status) {
    case 'active':   return 'green';
    case 'planned':  return 'blue';
    case 'finished': return 'gray';
    default:         return 'default';
  }
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'active':   return 'Activo';
    case 'planned':  return 'Previsto';
    case 'finished': return 'Finalizado';
    default:         return status;
  }
}

export default function Badge({ label, variant = 'default', size = 'xs' }: Props) {
  const sizeClass = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${variantMap[variant]}`}>
      {label}
    </span>
  );
}