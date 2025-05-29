import { FC } from 'react'
import type { ImageRenderInfo } from '../../app/types'
import { DEBUG_CONFIG } from '../constants/debugConfig'

interface ImageDebugProps {
  displayName: string
  imageUrl: string
  renderInfo: ImageRenderInfo
  screenDimensions: { 
    width: number
    height: number 
  }
}

export const ImageDebug: FC<ImageDebugProps> = ({
  displayName,
  imageUrl,
  renderInfo,
  screenDimensions
}) => {
  return (
    <div 
      className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 text-xs text-gray-100 min-w-[200px] sticky top-20"
      
      style={{
        zIndex: DEBUG_CONFIG.zIndex.debug
      }}
    >
      <h3 className="font-bold mb-2 text-white">{displayName}</h3>
      
      <div className="space-y-3">
        {/* Screen Dimensions */}
        <div className="mb-3">
          <div className="font-medium border-b border-gray-700 pb-1 text-white">Screen</div>
          <div className="pl-2 pt-1 space-y-1">
            <div className="flex gap-2">
              <span className="text-gray-400">Width:</span>
              <span className="text-gray-100">{screenDimensions.width}px</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Height:</span>
              <span className="text-gray-100">{screenDimensions.height}px</span>
            </div>
          </div>
        </div>

        {/* Container Dimensions */}
        <div className="mb-3">
          <div className="font-medium border-b border-gray-700 pb-1 text-white">Container</div>
          <div className="pl-2 pt-1 space-y-1">
            <div className="flex gap-2">
              <span className="text-gray-400">Width:</span>
              <span className="text-gray-100">{renderInfo.containerWidth}px</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Height:</span>
              <span className="text-gray-100">{renderInfo.containerHeight}px</span>
            </div>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="mb-3">
          <div className="font-medium border-b border-gray-700 pb-1 text-white">Aspect Ratio</div>
          <div className="pl-2 pt-1 space-y-1">
            <div className="flex gap-2">
              <span className="text-gray-400">Container:</span>
              <span className="text-gray-100">
                {renderInfo.debug?.calculatedAspectRatio ? 
                  renderInfo.debug.calculatedAspectRatio.toFixed(3) : 
                  'N/A'
                }
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Original:</span>
              <span className="text-gray-100">
                {renderInfo.debug?.sourceAspectRatio ? 
                  renderInfo.debug.sourceAspectRatio.toFixed(3) : 
                  'N/A'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Original Image Dimensions */}
        <div className="mb-3">
          <div className="font-medium border-b border-gray-700 pb-1 text-white">Original Image</div>
          <div className="pl-2 pt-1 space-y-1">
            <div className="flex gap-2">
              <span className="text-gray-400">Width:</span>
              <span className="text-gray-100">
                {renderInfo.debug?.originalDimensions?.width ? 
                  `${renderInfo.debug.originalDimensions.width}px` : 
                  'N/A'
                }
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Height:</span>
              <span className="text-gray-100">
                {renderInfo.debug?.originalDimensions?.height ? 
                  `${renderInfo.debug.originalDimensions.height}px` : 
                  'N/A'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Positioning */}
        <div className="mb-3">
          <div className="font-medium border-b border-gray-700 pb-1 text-white">Position</div>
          <div className="pl-2 pt-1 space-y-1">
            <div className="flex gap-2">
              <span className="text-gray-400">Object Fit:</span>
              <span className="text-gray-100">{renderInfo.objectFit}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">X:</span>
              <span className="text-gray-100">{renderInfo.objectPosition?.x.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">Y:</span>
              <span className="text-gray-100">{renderInfo.objectPosition?.y.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* URL */}
        <div className="mb-3 last:mb-0">
          <div className="font-medium border-b border-gray-700 pb-1 text-white">URL</div>
          <div className="pl-2 pt-1">
            <p className="break-all text-gray-400 text-[10px]">{imageUrl}</p>
          </div>
        </div>
      </div>
    </div>
  )
}