import { useEffect } from 'react'
import { useDebug } from '../context/DebugContext'

export const useDebugKeyboard = () => {
  const { toggleDebugMode, isDebugMode } = useDebug()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle debug mode with Ctrl+Shift+D
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault() // Prevent browser's default behavior
        console.log('Debug keyboard shortcut triggered', { 
          before: isDebugMode,
          combo: `${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`
        })
        toggleDebugMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleDebugMode, isDebugMode])
}