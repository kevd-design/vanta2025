export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-800 bg-opacity-30 backdrop-blur-sm">
      <div className="p-6 rounded-lg bg-white shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-emerald-800 font-medium">Loading...</p>
        </div>
      </div>
    </div>
  )
}