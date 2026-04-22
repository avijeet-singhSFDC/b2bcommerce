import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'

export function ToastContainer() {
  const { toasts, dismissToast } = useUiStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-in slide-in-from-right-4 ${
            toast.type === 'success' ? 'bg-white border-green-200' :
            toast.type === 'error' ? 'bg-white border-red-200' :
            'bg-white border-blue-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />}
          {toast.type === 'error' && <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />}
          <p className="text-sm text-gray-700 flex-1">{toast.message}</p>
          <button onClick={() => dismissToast(toast.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
