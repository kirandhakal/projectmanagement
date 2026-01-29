import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckSquare,
  List,
  Tag,
  Trash,
  Type,
  X,
  ArrowRight
} from "react-feather";

import Modal from "../../Modal/Modal";
import Editable from "../../Editabled/Editable";

function CardInfo(props) {
  const colors = [
    "#a8193d",
    "#4fcc25",
    "#1ebffa",
    "#8da377",
    "#9975bd",
    "#cf61a1",
    "#240959",
  ];

  const [selectedColor, setSelectedColor] = useState();
  const [values, setValues] = useState({
    ...props.card,
  });

  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  const updateDesc = (value) => {
    setValues({ ...values, desc: value });
  };

  const addLabel = (label) => {
    const index = values.labels.findIndex((item) => item.text === label.text);
    if (index > -1) return;

    setSelectedColor("");
    setValues({
      ...values,
      labels: [...values.labels, label],
    });
  };

  const removeLabel = (label) => {
    const tempLabels = values.labels.filter((item) => item.text !== label.text);

    setValues({
      ...values,
      labels: tempLabels,
    });
  };

  const addTask = (value) => {
    const task = {
      id: Date.now() + Math.random() * 2,
      completed: false,
      text: value,
    };
    setValues({
      ...values,
      tasks: [...values.tasks, task],
    });
  };

  const removeTask = (id) => {
    const tasks = [...values.tasks];

    const tempTasks = tasks.filter((item) => item.id !== id);
    setValues({
      ...values,
      tasks: tempTasks,
    });
  };

  const updateTask = (id, value) => {
    const tasks = [...values.tasks];

    const index = tasks.findIndex((item) => item.id === id);
    if (index < 0) return;

    tasks[index].completed = value;

    setValues({
      ...values,
      tasks,
    });
  };

  const calculatePercent = () => {
    if (!values.tasks?.length) return 0;
    const completed = values.tasks?.filter((item) => item.completed)?.length;
    return (completed / values.tasks?.length) * 100;
  };

  const updateDate = (date) => {
    if (!date) return;

    setValues({
      ...values,
      date,
    });
  };

  const { updateCard, boardId } = props;
  useEffect(() => {
    if (updateCard) updateCard(boardId, values.id, values);
  }, [values, updateCard, boardId]);

  return (
    <Modal onClose={props.onClose}>
      <div className="p-8 flex flex-col gap-8 min-w-[320px] md:min-w-[550px] max-w-[650px] w-full bg-white dark:bg-slate-900 rounded-xl overflow-y-auto max-h-[90vh]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white">
            <CheckSquare size={20} className="text-primary-purple" />
            <p className="font-bold text-lg">Status</p>
          </div>
          <div className="ml-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer h-6 w-12 appearance-none rounded-full bg-gray-200 dark:bg-slate-700 transition-colors checked:bg-primary-purple"
                  checked={values.completed || false}
                  onChange={(e) => setValues({ ...values, completed: e.target.checked })}
                />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-6" />
              </div>
              <span className={`text-sm font-semibold transition-colors ${values.completed ? 'text-primary-purple' : 'text-gray-500 dark:text-gray-400'}`}>
                {values.completed ? "✓ Completed" : "Mark as Complete"}
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white">
            <Type size={20} className="text-primary-purple" />
            <p className="font-bold text-lg">Title</p>
          </div>
          <div className="ml-8">
            <Editable
              defaultValue={values.title}
              text={values.title}
              placeholder="Enter Title"
              displayClass="text-2xl font-bold text-gray-800 dark:text-gray-100 px-3 py-2 -ml-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-text transition-all"
              editClass="text-2xl font-bold bg-white dark:bg-slate-800 border-2 border-primary-purple/30 rounded-lg p-2 outline-none w-full"
              onSubmit={updateTitle}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white">
            <List size={20} className="text-primary-purple" />
            <p className="font-bold text-lg">Description</p>
          </div>
          <div className="ml-8">
            <Editable
              defaultValue={values.desc}
              text={values.desc || "Add a Description..."}
              placeholder="Enter description"
              displayClass={`text-sm leading-relaxed px-3 py-2 -ml-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-text transition-all ${values.desc ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 italic'}`}
              editClass="text-sm bg-white dark:bg-slate-800 border-2 border-primary-purple/30 rounded-lg p-3 outline-none w-full min-h-[100px]"
              onSubmit={updateDesc}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white">
            <Calendar size={20} className="text-primary-purple" />
            <p className="font-bold text-lg">Due Date</p>
          </div>
          <div className="ml-8">
            <input
              type="date"
              className="px-4 py-2 border-2 border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:border-primary-purple transition-all outline-none"
              defaultValue={values.date}
              min={new Date().toISOString().substr(0, 10)}
              onChange={(event) => updateDate(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white">
            <Tag size={20} className="text-primary-purple" />
            <p className="font-bold text-lg">Labels</p>
          </div>
          <div className="ml-8 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {values.labels?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: item.color }}
                >
                  {item.text}
                  <X size={14} className="cursor-pointer hover:scale-110 transition-transform" onClick={() => removeLabel(item)} />
                </div>
              ))}
            </div>
            
            <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Color</p>
              <ul className="flex flex-wrap gap-3">
                {colors.map((item, index) => (
                  <li
                    key={index + item}
                    className={`h-6 w-6 rounded-full cursor-pointer transition-all duration-200 hover:scale-125 ${selectedColor === item ? 'ring-2 ring-offset-2 ring-primary-purple scale-110' : ''}`}
                    style={{ backgroundColor: item }}
                    onClick={() => setSelectedColor(item)}
                  />
                ))}
              </ul>
              <Editable
                text={
                  <div className="flex items-center gap-2 mt-2 text-primary-purple hover:text-primary-purple-dark text-sm font-semibold">
                    <X size={14} className="rotate-45" />
                    <span>Add Label</span>
                  </div>
                }
                placeholder="Label Name"
                displayClass="inline-block"
                editClass="bg-white dark:bg-slate-800 border-2 border-primary-purple/30 rounded-lg p-2 outline-none text-sm"
                onSubmit={(value) =>
                  addLabel({ color: selectedColor, text: value })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-900 dark:text-white">
              <CheckSquare size={20} className="text-primary-purple" />
              <p className="font-bold text-lg">Subtasks</p>
            </div>
            <span className="text-xs font-bold text-gray-400 px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded-md">
              {values.tasks?.filter(t => t.completed).length}/{values.tasks?.length}
            </span>
          </div>
          
          <div className="ml-8 flex flex-col gap-4">
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${calculatePercent()}%`,
                  backgroundColor: calculatePercent() === 100 ? "#10b981" : "#7b68ee",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              {values.tasks?.map((item) => (
                <div key={item.id} className="flex items-center gap-3 group bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 p-3 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all duration-200">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-primary-purple focus:ring-primary-purple cursor-pointer"
                    defaultChecked={item.completed}
                    onChange={(event) =>
                      updateTask(item.id, event.target.checked)
                    }
                  />
                  <p className={`flex-1 text-sm font-medium transition-all ${item.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                    {item.text}
                  </p>
                  <button 
                    className="p-1 px-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => removeTask(item.id)}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            <Editable
              text={
                <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 hover:text-primary-purple hover:border-primary-purple/50 transition-all">
                  <X size={14} className="rotate-45" />
                  <span className="text-sm font-medium">Add a Subtask</span>
                </div>
              }
              placeholder="What needs to be done?"
              displayClass="w-full"
              editClass="bg-white dark:bg-slate-800 border-2 border-primary-purple/30 rounded-lg p-3 outline-none w-full text-sm"
              onSubmit={addTask}
            />
          </div>
        </div>

        {calculatePercent() === 100 && values.tasks?.length > 0 && !props.isLastBoard && (
          <div className="mt-4 flex justify-end pt-6 border-t border-gray-100 dark:border-slate-800">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-accent-green hover:bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 animate-in slide-in-from-bottom-2 duration-300"
              onClick={() => {
                props.moveToNextBoard(props.boardId, values.id);
                props.onClose();
              }}
            >
              <span>Move to Next Board</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default CardInfo;
