import { FC } from 'react'

const Hamburger: FC = () => {
  return (
    <svg width="58" height="49" viewBox="0 0 58 49" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 5.5C0 2.46243 2.46243 0 5.5 0H52.5C55.5376 0 58 2.46243 58 5.5C58 8.53757 55.5376 11 52.5 11H5.5C2.46243 11 0 8.53757 0 5.5Z" className="fill-emerald-800"/>
      <rect className="fill-emerald-800" y="38" width="58" height="11" rx="5.5"/>
      <rect className="fill-emerald-800" y="19" width="58" height="11" rx="5.5"/>
    </svg>
  )
}

export default Hamburger