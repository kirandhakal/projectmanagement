import React from "react";

function Modal(props) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700 animate-in fade-in zoom-in duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
