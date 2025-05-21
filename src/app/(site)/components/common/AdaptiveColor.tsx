import { FC, ReactNode } from 'react';

type AdaptiveColorProps = {
  children: ReactNode;
  elementLabel: string;
  elementColors: {
    [key: string]: {
      color: 'text-black' | 'text-white' | 'background';
    };
  };
  palette?: {
    background: string;
    foreground: string;
  };
  className?: string;
};

export const AdaptiveColor: FC<AdaptiveColorProps> = ({
  children,
  elementLabel,
  elementColors,
  palette,
  className = ''
}) => {
  const getColorClasses = (): string => {
    const colorResult = elementColors[elementLabel]?.color;
    
    if (colorResult === 'background' && palette) {
      const bgColor = palette.background.replace('#', '');
      const textColor = palette.foreground.replace('#', '');
      return `bg-[#${bgColor}] text-[#${textColor}] px-4 py-2`;
    }
    
    if (colorResult === 'background') {
      return 'bg-black/50 px-4 py-2 text-white';
    }
    
    return colorResult || 'text-white';
  };

  return (
    <div className={`${getColorClasses()} ${className}`}>
      {children}
    </div>
  );
};