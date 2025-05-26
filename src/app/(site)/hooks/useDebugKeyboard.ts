import { useEffect } from 'react'
import { useDebug } from '../context/DebugContext'
import { useDebugLayout } from '../context/DebugLayoutContext'

export const useDebugKeyboard = () => {
  const { toggleDebugMode, isDebugMode } = useDebug()
  const { setDebugContent } = useDebugLayout()


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
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

  useEffect(() => {
    if (!isDebugMode) {
      setDebugContent({
        colorMap: [],
        elementMap: [],
        dimensions: { width: 0, height: 0 },
        accessibilityResults: { elementColors: {} }
      })
    }
  }, [isDebugMode, setDebugContent])
}