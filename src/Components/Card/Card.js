import React, { useState } from "react";
import { CheckSquare, Clock, MoreHorizontal, Check, ArrowRight } from "react-feather";

import Dropdown from "../Dropdown/Dropdown";

import CardInfo from "./CardInfo/CardInfo";

function Card(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { id, title, date, tasks, labels, completed } = props.card;

  const toggleCompleted = (e) => {
    e.stopPropagation();
    const updatedCard = {
      ...props.card,
      completed: !completed
    };
    props.updateCard(props.boardId, id, updatedCard);
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (!date) return "";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Aprl",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    return day + " " + month;
  };

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={props.card}
          boardId={props.boardId}
          updateCard={props.updateCard}
          moveToNextBoard={props.moveToNextBoard}
          isLastBoard={props.isLastBoard}
        />
      )}
      <div
        className={`p-4 flex flex-col gap-4 rounded-xl border transition-all duration-200 cursor-pointer relative group ${
          completed 
            ? 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700 opacity-70 hover:opacity-100' 
            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary-purple'
        }`}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", id);
          e.dataTransfer.effectAllowed = "move";
        }}
        onDragEnd={() => props.dragEnded(props.boardId, id)}
        onDragEnter={(e) => {
          e.stopPropagation();
          props.dragEntered(props.boardId, id);
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                completed 
                  ? 'bg-primary-purple border-primary-purple text-white hover:bg-primary-purple-dark' 
                  : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-primary-purple hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
              }`}
              onClick={toggleCompleted}
            >
              {completed && <Check size={14} />}
            </div>
          </div>
          <div className="flex-1 flex flex-wrap gap-1.5 overflow-hidden">
            {labels?.map((item, index) => (
              <label 
                key={index} 
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.text}
              </label>
            ))}
          </div>
          <div
            className="w-6 h-6 flex items-center justify-center rounded-md cursor-pointer text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-all"
            onClick={(event) => {
              event.stopPropagation();
              setShowDropdown(true);
            }}
          >
            <MoreHorizontal size={16} />
            {showDropdown && (
              <Dropdown
                class="absolute right-0 top-full mt-2 z-50 shadow-xl p-2 w-[150px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg"
                onClose={() => setShowDropdown(false)}
              >
                <p 
                  className="px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" 
                  onClick={() => props.removeCard(props.boardId, id)}
                >
                  Delete Card
                </p>
              </Dropdown>
            )}
          </div>
        </div>
        <div className={`text-sm font-medium leading-relaxed ${completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
          {title}
        </div>
        <div className="flex items-center gap-4 mt-auto">
          {date && (
            <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium">
              <Clock size={14} />
              {formatDate(date)}
            </p>
          )}
          {tasks && tasks?.length > 0 && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500">
              <CheckSquare size={14} className={tasks.every(t => t.completed) ? 'text-accent-green' : ''} />
              <span className={tasks.every(t => t.completed) ? 'text-accent-green' : ''}>
                {tasks?.filter((item) => item.completed)?.length}/{tasks?.length}
              </span>
            </p>
          )}
          {tasks && tasks?.length > 0 && tasks.every(t => t.completed) && !props.isLastBoard && (
            <button 
              className="ml-auto p-1.5 bg-accent-green hover:bg-green-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all animate-pulse"
              onClick={(e) => {
                e.stopPropagation();
                props.moveToNextBoard(props.boardId, id);
              }}
              title="Move to next board"
            >
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
