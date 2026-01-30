import React, { useEffect, useRef } from "react";

function Dropdown(props) {
  const dropdownRef = useRef();

  const handleClick = (event) => {
    if (
      dropdownRef &&
      !dropdownRef.current?.contains(event.target) &&
      props.onClose
    )
      props.onClose();
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 min-w-max bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl p-1 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700 ${props.class ? props.class : ""}`}
    >
      {props.children}
    </div>
  );
}

export default Dropdown;
