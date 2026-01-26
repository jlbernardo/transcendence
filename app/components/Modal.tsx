import { ReactNode } from "react"
import { createPortal } from "react-dom"

type ModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="relative z-10 rounded-lg bg-white p-6">
        {children}
      </div>
    </div>,
    document.body
  )
}
