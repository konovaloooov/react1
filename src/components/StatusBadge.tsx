interface StatusBadgeProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
}

export function StatusBadge({ isActive, activeText = 'В наличии', inactiveText = 'Нет' }: StatusBadgeProps) {
  return (
    <span className={`badge ${isActive ? 'text-bg-success' : 'text-bg-secondary'}`}>
      {isActive ? activeText : inactiveText}
    </span>
  );
}
