import { FC } from 'react'
import type { ImageDebugOverlayProps } from '@/app/types'



export const ImageDebugOverlay: FC<ImageDebugOverlayProps> = ({
  show,
  imageUrl,
  renderInfo,
  screenDimensions
}) => {
  if (!show) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4 font-mono text-xs">
      <div className="space-y-2">
        <p>Screen: {screenDimensions.width}x{screenDimensions.height}</p>
        <p>Container: {renderInfo.containerWidth}x{renderInfo.containerHeight}</p>
        <p className="break-all">URL: {imageUrl}</p>
        <p>Object Fit: {renderInfo.objectFit}</p>
        <p>Position: x:{renderInfo.objectPosition?.x ?? 0} y:{renderInfo.objectPosition?.y ?? 0}</p>
      </div>
    </div>
  )
}