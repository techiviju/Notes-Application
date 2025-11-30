 //  new UI 
import PropTypes from "prop-types";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800",
    warning: "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700",
    info: "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="rounded-2xl bg-[#f0f2f9] max-w-md w-full mx-4 shadow-[0_6px_48px_12px_rgba(53,72,105,0.10),8px_8px_32px_#dbeafe] neumorph-modal transition-all border border-blue-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-center gap-2">
          <svg className="w-8 h-8 text-blue-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <path d="M12 8v4m0 4h.01" strokeWidth={2} />
          </svg>
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        </div>

        {/* Body */}
        <div className="px-6 pb-2 pt-2">
          <p className="text-slate-600">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 bg-white border border-blue-100 rounded-lg hover:bg-blue-50 shadow transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg shadow font-bold transition ${typeStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(["danger", "warning", "info"]),
};

export default Modal;

