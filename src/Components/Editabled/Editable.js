import React, { useState } from "react";

import { X } from "react-feather";

function Editable(props) {
  const [isEditable, setIsEditable] = useState(false);
  const [inputText, setInputText] = useState(props.defaultValue ?? "");

  const openEdit = () => {
    setInputText(props.defaultValue ?? (typeof props.text === "string" ? props.text : "") ?? "");
    setIsEditable(true);
  };

  const submission = (e) => {
    e.preventDefault();
    if (inputText && props.onSubmit) {
      setInputText("");
      props.onSubmit(inputText);
    }
    setIsEditable(false);
  };

  const cancelEdit = () => {
    setIsEditable(false);
    setInputText(props.defaultValue ?? "");
  };

  return (
    <div className="w-full">
      {isEditable ? (
        <form
          className={`flex flex-col gap-3 ${props.editClass ? props.editClass : ""}`}
          onSubmit={submission}
        >
          <input
            type="text"
            className="w-full px-4 py-2 border-2 border-primary-purple/30 focus:border-primary-purple bg-white dark:bg-slate-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 outline-none transition-all duration-200"
            value={inputText}
            placeholder={props.placeholder || (typeof props.text === "string" ? props.text : "")}
            onChange={(event) => setInputText(event.target.value)}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-primary-purple hover:bg-primary-purple-dark text-white rounded-lg text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {props.buttonText || "Add"}
            </button>
            {props.cancelButtonText ? (
              <button
                type="button"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={cancelEdit}
              >
                {props.cancelButtonText}
              </button>
            ) : (
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                onClick={cancelEdit}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>
      ) : (
        <div
          className={`cursor-pointer transition-all duration-200 ${
            props.displayClass ? props.displayClass : ""
          }`}
          onClick={openEdit}
        >
          {props.text}
        </div>
      )}
    </div>
  );
}

export default Editable;
