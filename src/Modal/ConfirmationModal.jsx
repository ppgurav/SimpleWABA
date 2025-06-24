import { X } from "lucide-react"
import React from "react"

export default function ConfirmationModal({ isOpen, onClose, onDiscard }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Unsaved Changes</h2>
        <p className="text-gray-600 mb-6">
          You have unsaved changes. Are you sure you want to go back? Your changes will be lost.
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onDiscard} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}
