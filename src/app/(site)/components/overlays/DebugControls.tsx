import { FC } from 'react'
import { OVERLAY_CONFIG } from './constants'
import type { DebugControlsProps } from './types'

export const DebugControls: FC<DebugControlsProps> = ({
  showColorMap,
  showElementMap,
  onToggleColorMap,
  onToggleElementMap
}) => {
  return (
    <div className={`absolute top-24 right-4 flex flex-col gap-2`}
    style={{ zIndex: OVERLAY_CONFIG.zIndex.controls }}
    >
      <button
        onClick={onToggleColorMap}
        className="bg-black/50 text-white px-4 py-2 rounded hover:bg-black/70"
      >
        {showColorMap ? 'Hide Color Map' : 'Show Color Map'}
      </button>
      <button
        onClick={onToggleElementMap}
        className="bg-black/50 text-white px-4 py-2 rounded hover:bg-black/70"
      >
        {showElementMap ? 'Hide Element Map' : 'Show Element Map'}
      </button>
    </div>
  )
}