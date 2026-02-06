import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ControlButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  ariaLabel: string;
  title?: string;
  bgColor?: string;
  textColor?: string;
  hoverBgColor?: string;
  size?: number;
}

const ControlButton = React.memo<ControlButtonProps>(({
  icon: Icon,
  onClick,
  ariaLabel,
  title,
  bgColor = 'bg-white',
  textColor = 'text-gray-700',
  hoverBgColor = 'hover:bg-gray-100',
  size = 20,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${bgColor} ${textColor} ${hoverBgColor} shadow-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2`}
      aria-label={ariaLabel}
      title={title || ariaLabel}
    >
      <Icon size={size} className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
});

ControlButton.displayName = 'ControlButton';

export default ControlButton;
