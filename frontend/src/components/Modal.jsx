import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, wide }) {
  return (
    <dialog className="modal modal-open">
      <div className={`modal-box ${wide ? 'max-w-3xl' : ''}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="btn btn-ghost btn-sm btn-square" onClick={onClose} aria-label="Close"><X className="size-4" /></button>
        </div>
        {children}
      </div>
      <div className="modal-backdrop bg-black/30" onClick={onClose} />
    </dialog>
  );
}
