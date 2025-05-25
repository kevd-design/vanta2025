import { FC } from 'react'
import type { ImageRenderInfo } from '../../../../types'
import { OVERLAY_CONFIG } from '../../overlays/constants'

interface ImageDebugProps {
  imageUrl: string
  renderInfo: ImageRenderInfo
  screenDimensions: { 
    width: number
    height: number 
  }
}


export const ImageDebug: FC<ImageDebugProps> = ({
  imageUrl,
  renderInfo,
  screenDimensions
}) => {
  return (
    <div 
      className="bg-black/40 text-white p-4 font-mono text-xs rounded-lg backdrop-blur-sm max-w-[400px]"
      style={{
        zIndex: OVERLAY_CONFIG.zIndex.debug + 100,
        maxWidth: '400px'
      }}
    >
      <div className="space-y-2">
        <p>Screen: {screenDimensions.width}x{screenDimensions.height}</p>
        <p>Container: {renderInfo.containerWidth}x{renderInfo.containerHeight}</p>
        <p>Aspect Ratio: {renderInfo.debug?.calculatedAspectRatio.toFixed(3)} 
           (Source: {renderInfo.debug?.sourceAspectRatio.toFixed(3)})</p>
        <p>Original: {renderInfo.debug?.originalDimensions?.width}x
                     {renderInfo.debug?.originalDimensions?.height}</p>
        <p>Object Fit: {renderInfo.objectFit}</p>
        <p>Position: x:{renderInfo.objectPosition?.x.toFixed(2)} 
                     y:{renderInfo.objectPosition?.y.toFixed(2)}</p>
        <p className="break-all text-gray-400 text-[10px] mt-2">URL: {imageUrl}</p>
      </div>
    </div>
  )
}