import { usePathname } from 'next/navigation'

export const useActivePage = () => {
  const pathname = usePathname()
  return {
    isActivePage: (href: string) => pathname === href,
    currentPath: pathname
  }
}