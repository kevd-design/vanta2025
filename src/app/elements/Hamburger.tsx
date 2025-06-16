import { FC } from 'react'

interface HamburgerProps {
  color?: 'light' | 'dark';
}

const Hamburger: FC<HamburgerProps> = ({ color = 'light' }) => {
  // Use the appropriate color based on the variant
  // 'light' variant = white hamburger (for dark backgrounds)
  // 'dark' variant = black hamburger (for light backgrounds)
  const svgFill = color === 'light' ? '#FFFFFF' : '#000000'
  
  return (
    <svg width="48" height="33" viewBox="0 0 48 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 3.5C0 1.567 1.567 -3.8147e-06 3.5 -3.8147e-06H44.5C46.433 -3.8147e-06 48 1.567 48 3.5C48 5.43299 46.433 7 44.5 7H3.5C1.567 7 0 5.43299 0 3.5Z" fill={svgFill}/>
      <rect y="13" width="48" height="7" rx="3.5" fill={svgFill}/>
      <rect y="26" width="48" height="7" rx="3.5" fill={svgFill}/>
    </svg>
  )
}

export default Hamburger


