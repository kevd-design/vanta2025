import { FC } from 'react'

interface HamburgerProps {
  color?: 'light' | 'dark' | 'green';
  className?: string;
}

const Hamburger: FC<HamburgerProps> = ({ color = 'light', className = '' }) => {
  // Get the appropriate Tailwind fill class and hover class based on the variant
  const getColorClasses = () => {
    switch(color) {
      case 'light':
        return 'fill-white hover:fill-emerald-200';
      case 'green':
        return 'fill-emerald-800 hover:fill-emerald-600';
      case 'dark':
      default:
        return 'fill-black hover:fill-gray-700';
    }
  }
  
  return (
    <svg 
      width="48" 
      height="33" 
      viewBox="0 0 48 33" 
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-colors duration-300 cursor-pointer ${className}`}
    >
      <g className={getColorClasses()}>
        <path 
          d="M0 3.5C0 1.567 1.567 -3.8147e-06 3.5 -3.8147e-06H44.5C46.433 -3.8147e-06 48 1.567 48 3.5C48 5.43299 46.433 7 44.5 7H3.5C1.567 7 0 5.43299 0 3.5Z" 
        />
        <rect 
          y="13" 
          width="48" 
          height="7" 
          rx="3.5"
        />
        <rect 
          y="26" 
          width="48" 
          height="7" 
          rx="3.5"
        />
      </g>
    </svg>
  )
}

export default Hamburger


