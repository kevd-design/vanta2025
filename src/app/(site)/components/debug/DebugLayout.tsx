'use client'

import { FC, PropsWithChildren } from 'react'
import { useDebug } from '../../context/DebugContext'
import { useDebugLayout } from '../../context/DebugLayoutContext'
import { useWindowSize } from '../../hooks/useWindowSize'
import { AccessibilityDebug } from './components/AccessibilityDebug'
import { ImageDebug } from './components/ImageDebug'

export const DebugLayout: FC<PropsWithChildren> = ({ children }) => {
  const { isDebugMode } = useDebug()
  const { debugContent } = useDebugLayout()
  const { width: screenWidth, height: screenHeight } = useWindowSize()

  return (
    <div className="min-h-screen">
      {isDebugMode && debugContent && (
        <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
          <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
            {debugContent.colorMap && (
              <AccessibilityDebug 
                colorMap={debugContent.colorMap}
                elementMap={debugContent.elementMap}
                dimensions={debugContent.dimensions}
                accessibilityResults={debugContent.accessibilityResults}
                screenDimensions={{
                  width: screenWidth,
                  height: screenHeight
                }}
              />
            )}
            {debugContent.imageDebug && (
              <ImageDebug 
                imageUrl={debugContent.imageDebug.imageUrl}
                renderInfo={debugContent.imageDebug.renderInfo}
                screenDimensions={debugContent.imageDebug.screenDimensions}
              />
            )}
          </div>
        </div>
      )}
      <div className={`relative flex-1 ${isDebugMode ? 'pt-32' : ''}`}>
        {children}
      </div>
    </div>
  )
}