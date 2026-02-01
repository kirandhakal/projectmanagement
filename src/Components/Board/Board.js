import React, { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import Editable from "../Editabled/Editable";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  const cardCount = props.board?.cards?.length || 0;

  return (
    <div
      className="min-w-[320px] w-[320px] max-h-full flex flex-col gap-4 bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md"
      onDragEnter={() => props.dragEntered(props.board?.id, "")}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-700" onDragEnter={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 shadow-[0_0_0_3px_rgba(123,104,238,0.1)]"
            style={{ backgroundColor: props.board?.color }}
          />
          <div className="flex-1 min-w-0">
            <Editable
              defaultValue={props.board?.title}
              text={props.board?.title}
              placeholder="Board title"
              displayClass="font-semibold text-base text-gray-900 dark:text-white truncate m-0 leading-tight cursor-text hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded px-1 -ml-1 py-0.5"
              editClass="font-semibold text-base bg-white dark:bg-slate-800 border-2 border-primary-purple/30 rounded-lg p-2 outline-none w-full"
              onSubmit={(value) => props.updateBoardTitle?.(props.board?.id, value)}
              buttonText="Save"
              cancelButtonText="Cancel"
            />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium block mt-0.5">{cardCount} {cardCount === 1 ? 'task' : 'tasks'}</span>
          </div>
        </div>
        <div
          className="relative cursor-pointer p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 flex items-center justify-center"
          onClick={() => setShowDropdown(true)}
        >
          <MoreHorizontal size={18} />
          {showDropdown && (
            <Dropdown
              class="absolute right-0 top-full mt-2 z-50 shadow-xl p-2 w-[180px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg"
              onClose={() => setShowDropdown(false)}
            >
              <div className="px-4 py-2 rounded-md cursor-pointer text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" onClick={() => props.removeBoard()}>
                Delete Board
              </div>
            </Dropdown>
          )}
        </div>
      </div>

      <div
        className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700"
        onDragOver={(e) => e.preventDefault()}
      >
        {props.board?.cards?.map((item, index) => (
          <Card
            key={item.id}
            card={item}
            boardId={props.board.id}
            removeCard={props.removeCard}
            dragEntered={props.dragEntered}
            dragEnded={props.dragEnded}
            updateCard={props.updateCard}
            moveToNextBoard={props.moveToNextBoard}
            moveToLastBoard={props.moveToLastBoard}
            isFirstBoard={index === 0}
            isLastBoard={props.isLastBoard}
          />
        ))}

        <Editable
          text={
            <div className="flex items-center gap-2">
              <Plus size={16} />
              <span className="font-medium text-sm text-red-500">Add Task</span>
            </div>
          }
          placeholder="Enter task title..."
          displayClass="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary-purple dark:hover:text-primary-purple-light hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-primary-purple/20 transition-all duration-200"
          editClass="p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col gap-3"
          onSubmit={(value) => props.addCard(props.board?.id, value)}
          buttonText="Finish"
          cancelButtonText="Cancel"
        />
      </div>
    </div>
  );
}

export default Board;
