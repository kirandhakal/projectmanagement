import React, { useEffect, useState, useRef } from "react";
import {
  Calendar,
  CheckSquare,
  List,
  Tag,
  Trash,
  Type,
  X,
  ArrowRight,
  Image,
  UserPlus,
  Users
} from "react-feather";

import Modal from "../../Modal/Modal";
import Editable from "../../Editabled/Editable";

function normalizeAssignees(assignees) {
  if (!assignees?.length) return [];
  return assignees.map((a, i) => {
    if (typeof a === "string") return { id: `legacy-${i}`, role: "Assignee", name: a };
    if (a.role != null && a.name != null) return { id: a.id || `a-${i}`, role: a.role, name: a.name };
    return { id: a.id || `a-${i}`, role: "Assignee", name: a.name || "" };
  });
}

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
    descMedia: props.card.descMedia || [],
    tasks: (props.card.tasks || []).map((t) => ({ ...t, media: t.media || [] })),
    assignees: normalizeAssignees(props.card.assignees),
  });
  const descFileRef = useRef(null);

  const getCountdown = (dateStr) => {
    if (!dateStr) return null;
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffMs = due - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}`, overdue: true };
    if (diffDays === 0) return { text: "Due today", overdue: false };
    return { text: `${diffDays} day${diffDays !== 1 ? "s" : ""} left`, overdue: false };
  };

  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  const updateDesc = (value) => {
    setValues({ ...values, desc: value });
  };

  const addDescMedia = (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fileList = Array.from(files);
    const results = new Array(fileList.length);
    let done = 0;
    fileList.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const isPdf = file.type === "application/pdf" || (file.name && file.name.toLowerCase().endsWith(".pdf"));
        results[i] = {
          type: file.type.startsWith("image/") ? "image" : isPdf ? "pdf" : "file",
          data: ev.target.result,
          name: file.name
        };
        done++;
        if (done === fileList.length) {
          const toAdd = results.filter(Boolean);
          setValues((prev) => ({ ...prev, descMedia: [...(prev.descMedia || []), ...toAdd] }));
        }
      };
      reader.onerror = () => {
        done++;
        if (done === fileList.length) {
          const toAdd = results.filter(Boolean);
          if (toAdd.length) setValues((prev) => ({ ...prev, descMedia: [...(prev.descMedia || []), ...toAdd] }));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeDescMedia = (index) => {
    const next = [...(values.descMedia || [])];
    next.splice(index, 1);
    setValues({ ...values, descMedia: next });
  };

  const addTaskMedia = (taskId, e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const tasks = [...(values.tasks || [])];
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx < 0) return;
    const task = { ...tasks[idx], media: tasks[idx].media || [] };
    const toAdd = [];
    let processed = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        toAdd.push({ type: file.type.startsWith("image/") ? "image" : "file", data: ev.target.result, name: file.name });
        processed++;
        if (processed === files.length) {
          task.media = [...task.media, ...toAdd];
          tasks[idx] = task;
          setValues({ ...values, tasks });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeTaskMedia = (taskId, mediaIndex) => {
    const tasks = [...(values.tasks || [])];
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx < 0) return;
    const task = { ...tasks[idx], media: [...(tasks[idx].media || [])] };
    task.media.splice(mediaIndex, 1);
    tasks[idx] = task;
    setValues({ ...values, tasks });
  };

  const addAssignee = () => {
    const assignees = [...(values.assignees || [])];
    assignees.push({ id: `a-${Date.now()}-${Math.random().toString(36).slice(2)}`, role: "", name: "" });
    setValues({ ...values, assignees });
  };

  const updateAssignee = (index, field, value) => {
    const assignees = [...(values.assignees || [])];
    if (!assignees[index]) return;
    assignees[index] = { ...assignees[index], [field]: value };
    setValues({ ...values, assignees });
  };

  const removeAssignee = (index) => {
    const assignees = [...(values.assignees || [])].filter((_, i) => i !== index);
    setValues({ ...values, assignees });
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
      media: [],
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
      <div className="min-w-[320px] md:min-w-[550px] max-w-[650px] w-full bg-white dark:bg-slate-900 rounded-xl overflow-y-auto max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Task details</h2>
          <button
            type="button"
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            onClick={props.onClose}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 pt-4 flex flex-col gap-8 overflow-y-auto">
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
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setValues({ ...values, completed: checked });
                    if (checked && !props.isLastBoard && props.moveToLastBoard) {
                      const updatedCard = { ...values, completed: true };
                      props.updateCard(props.boardId, values.id, updatedCard);
                      props.moveToLastBoard(props.boardId, values.id, updatedCard);
                      props.onClose();
                    }
                  }}
                />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-6" />
              </div>
              <span className={`text-sm font-semibold transition-colors ${values.completed ? 'text-primary-purple' : 'text-gray-500 dark:text-gray-400'}`}>
                {values.completed ? "✓ Completed" : "Mark as Complete"}
              </span>
            </label>
            {values.completed && !props.isLastBoard && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Task will move to the last board.</p>
            )}
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
              editClass="text-2xl font-bold bg-white dark:bg-slate-800 border-2 border-primary-purple/30 rounded-lg p-2 outline-none w-full flex flex-col gap-3"
              onSubmit={updateTitle}
              buttonText="Save"
              cancelButtonText="Cancel"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-gray-900 dark:text-white">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-primary-purple" />
              <p className="font-bold text-lg">Assignees</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-purple/10 hover:bg-primary-purple/20 text-primary-purple dark:text-primary-purple-light rounded-lg text-sm font-semibold transition-all"
              onClick={addAssignee}
            >
              <UserPlus size={14} />
              Add assignee
            </button>
          </div>
          <div className="ml-8">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Assign by role (e.g. Developer, Testing, Reviewer) and person name.</p>
            {values.assignees?.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic py-2">No assignees yet. Click &quot;Add assignee&quot; to add role and person.</p>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Changes save automatically. Use Close (X) above when done.</p>
                {values.assignees.map((a, i) => (
                  <div key={a.id || i} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <input
                      type="text"
                      placeholder="Role (e.g. Developer)"
                      className="flex-1 min-w-0 px-3 py-2 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:border-primary-purple outline-none transition-all"
                      value={a.role || ""}
                      onChange={(e) => updateAssignee(i, "role", e.target.value)}
                    />
                    <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">–</span>
                    <input
                      type="text"
                      placeholder="Person name"
                      className="flex-1 min-w-0 px-3 py-2 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:border-primary-purple outline-none transition-all"
                      value={a.name || ""}
                      onChange={(e) => updateAssignee(i, "name", e.target.value)}
                    />
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex-shrink-0"
                      onClick={() => removeAssignee(i)}
                      title="Remove assignee"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white">
            <List size={20} className="text-primary-purple" />
            <p className="font-bold text-lg">Description</p>
          </div>
          <div className="ml-8 relative">
            <Editable
              defaultValue={values.desc}
              text={values.desc || "Add a Description..."}
              placeholder="Enter description"
              displayClass={`text-sm leading-relaxed px-3 py-2 -ml-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-text transition-all ${values.desc ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 italic'}`}
              editClass="text-sm bg-white dark:bg-slate-800 border-2 border-primary-purple/30 rounded-lg p-3 outline-none w-full min-h-[100px] flex flex-col gap-3"
              onSubmit={updateDesc}
              buttonText="Save"
              cancelButtonText="Cancel"
            />
            <input
              ref={descFileRef}
              id="desc-file-input"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              className="absolute w-0 h-0 opacity-0 overflow-hidden"
              multiple
              onChange={addDescMedia}
            />
            <label
              htmlFor="desc-file-input"
              className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-primary-purple hover:text-primary-purple text-sm font-medium transition-all cursor-pointer"
            >
              <Image size={16} />
              Upload image or file
            </label>
            {values.descMedia?.length > 0 && (
              <div className="mt-2 flex flex-col gap-3">
                {values.descMedia.map((m, i) => (
                  <div key={i} className="relative group">
                    {m.type === "image" ? (
                      <img src={m.data} alt={m.name} className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-slate-600" />
                    ) : m.type === "pdf" ? (
                      <div className="rounded-lg border border-gray-200 dark:border-slate-600 overflow-hidden bg-gray-50 dark:bg-slate-800">
                        <div className="px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-slate-600 truncate">{m.name}</div>
                        <embed
                          src={m.data}
                          type="application/pdf"
                          className="w-full h-[280px]"
                          title={m.name}
                        />
                      </div>
                    ) : (
                      <a href={m.data} download={m.name} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-xs font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">
                        {m.name}
                      </a>
                    )}
                    <button type="button" className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => removeDescMedia(i)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white">
            <Calendar size={20} className="text-primary-purple" />
            <p className="font-bold text-lg">Due Date</p>
          </div>
          <div className="ml-8 flex flex-col gap-2">
            <input
              type="date"
              className="px-4 py-2 border-2 border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:border-primary-purple transition-all outline-none"
              defaultValue={values.date}
              min={new Date().toISOString().substr(0, 10)}
              onChange={(event) => updateDate(event.target.value)}
            />
            {values.date && getCountdown(values.date) && (
              <p className={`text-sm font-semibold ${getCountdown(values.date).overdue ? "text-red-500 dark:text-red-400" : "text-primary-purple dark:text-primary-purple-light"}`}>
                {getCountdown(values.date).text}
              </p>
            )}
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
                editClass="bg-white dark:bg-slate-800 border-2 border-primary-purple/30 rounded-lg p-2 outline-none text-sm flex flex-col gap-3"
                onSubmit={(value) =>
                  addLabel({ color: selectedColor, text: value })
                }
                buttonText="Add"
                cancelButtonText="Cancel"
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
                <div key={item.id} className="flex flex-col gap-2 group bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 p-3 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all duration-200">
                  <div className="flex items-center gap-3">
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
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                      id={`task-media-${item.id}`}
                      multiple
                      onChange={(e) => addTaskMedia(item.id, e)}
                    />
                    <label htmlFor={`task-media-${item.id}`} className="p-1.5 rounded-md text-gray-400 hover:text-primary-purple hover:bg-primary-purple/10 cursor-pointer transition-all" title="Attach file">
                      <Image size={14} />
                    </label>
                    <button 
                      className="p-1 px-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => removeTask(item.id)}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                  {item.media?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pl-8">
                      {item.media.map((m, mi) => (
                        <div key={mi} className="relative group/thumb">
                          {m.type === "image" ? (
                            <img src={m.data} alt={m.name} className="h-14 w-14 object-cover rounded border border-gray-200 dark:border-slate-600" />
                          ) : (
                            <a href={m.data} download={m.name} className="flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-slate-600 text-xs font-medium text-gray-700 dark:text-gray-200 truncate max-w-[100px]">
                              {m.name}
                            </a>
                          )}
                          <button type="button" className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity" onClick={() => removeTaskMedia(item.id, mi)}>
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
              editClass="bg-white dark:bg-slate-800 border-2 border-primary-purple/30 rounded-lg p-3 outline-none w-full text-sm flex flex-col gap-3"
              onSubmit={addTask}
              buttonText="Finish"
              cancelButtonText="Cancel"
            />
          </div>
        </div>

        {calculatePercent() === 100 && values.tasks?.length > 0 && !props.isLastBoard && (
          <div className="mt-4 flex justify-end pt-6 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 bg-accent-green hover:bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 animate-in slide-in-from-bottom-2 duration-300"
              onClick={(e) => {
                e.stopPropagation();
                props.updateCard(props.boardId, values.id, values);
                props.moveToNextBoard(props.boardId, values.id, values);
                props.onClose();
              }}
            >
              <span>Move to Next Board</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
        </div>
      </div>
    </Modal>
  );
}

export default CardInfo;
