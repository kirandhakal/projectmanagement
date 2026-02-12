import React, { useEffect, useState } from "react";
import {
  Search,
  Moon,
  Sun,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Folder,
  ChevronDown,
  ChevronRight,
  Home,
  Calendar,
  Settings,
  Users,
  GitPullRequest
} from "lucide-react";

import Board from "./Components/Board/Board";
import Editable from "./Components/Editabled/Editable";
import WorkflowView from "./views/WorkflowView";
import TeamView from "./views/TeamView";

// tailwind.css is imported in index.js via index.css

function App() {
  const [projects, setProjects] = useState(
    JSON.parse(localStorage.getItem("prac-kanban-projects")) || [
      {
        id: 1,
        name: "My First Project",
        color: "#7b68ee",
        boards: []
      }
    ]
  );

  const [activeProjectId, setActiveProjectId] = useState(
    localStorage.getItem("active-project-id") || projects[0]?.id || null
  );

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState(
    JSON.parse(localStorage.getItem("expanded-projects")) || [projects[0]?.id]
  );

  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("board");
  const [activeNav, setActiveNav] = useState(
    localStorage.getItem("activeNav") || "kanban"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("prac-kanban-projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("active-project-id", activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    localStorage.setItem("expanded-projects", JSON.stringify(expandedProjects));
  }, [expandedProjects]);

  useEffect(() => {
    localStorage.setItem("activeNav", activeNav);
  }, [activeNav]);

  const activeProject = projects.find(p => p.id === activeProjectId);
  const boards = activeProject?.boards || [];

  const addProjectHandler = (name) => {
    const newProject = {
      id: Date.now() + Math.random() * 2,
      name: name,
      color: getRandomColor(),
      boards: []
    };
    setProjects([...projects, newProject]);
    setActiveProjectId(newProject.id);
    setExpandedProjects([...expandedProjects, newProject.id]);
  };

  const addBoardHandler = (name) => {
    const updatedProjects = projects.map(project => {
      if (project.id === activeProjectId) {
        return {
          ...project,
          boards: [...project.boards, {
            id: Date.now() + Math.random() * 2,
            title: name,
            cards: [],
            color: getRandomBoardColor(),
          }]
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const getRandomColor = () => {
    const colors = [
      "#7b68ee", "#ff6b9d", "#49ccf9", "#00d4aa", "#ffa800", "#ff6b6b",
      "#9b59b6", "#3498db", "#e74c3c", "#f39c12", "#1abc9c", "#34495e"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomBoardColor = () => {
    const colors = [
      "#7b68ee", "#ff6b9d", "#49ccf9", "#00d4aa", "#ffa800", "#ff6b6b"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const removeBoard = (id) => {
    const updatedProjects = projects.map(project => {
      if (project.id === activeProjectId) {
        return {
          ...project,
          boards: project.boards.filter(board => board.id !== id)
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const updateBoardTitle = (boardId, newTitle) => {
    if (!newTitle?.trim()) return;
    const updatedProjects = projects.map(project => {
      if (project.id === activeProjectId) {
        return {
          ...project,
          boards: project.boards.map(board =>
            board.id === boardId ? { ...board, title: newTitle.trim() } : board
          )
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const addCardHandler = (id, title) => {
    const updatedProjects = projects.map(project => {
      if (project.id === activeProjectId) {
        return {
          ...project,
          boards: project.boards.map(board => {
            if (board.id === id) {
              return {
                ...board,
                cards: [...board.cards, {
                  id: Date.now() + Math.random() * 2,
                  title,
                  labels: [],
                  date: "",
                  tasks: [],
                  priority: "medium",
                  assignees: [],
                  description: "",
                  descMedia: [],
                  completed: false,
                }]
              };
            }
            return board;
          })
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const removeCard = (bid, cid) => {
    const updatedProjects = projects.map(project => {
      if (project.id === activeProjectId) {
        return {
          ...project,
          boards: project.boards.map(board => {
            if (board.id === bid) {
              return {
                ...board,
                cards: board.cards.filter(card => card.id !== cid)
              };
            }
            return board;
          })
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const dragEnded = (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    const updatedProjects = projects.map((project) => {
      if (project.id === activeProjectId) {
        const newBoards = [...project.boards];

        s_boardIndex = newBoards.findIndex((item) => item.id === bid);
        if (s_boardIndex < 0) return project;

        s_cardIndex = newBoards[s_boardIndex]?.cards?.findIndex(
          (item) => item.id === cid
        );
        if (s_cardIndex < 0) return project;

        t_boardIndex = newBoards.findIndex((item) => item.id === targetCard.bid);
        if (t_boardIndex < 0) return project;

        t_cardIndex = newBoards[t_boardIndex]?.cards?.findIndex(
          (item) => item.id === targetCard.cid
        );

        // If target card is not found (e.g. empty board), append to end
        if (t_cardIndex < 0) {
          t_cardIndex = newBoards[t_boardIndex].cards.length;
        }

        const sourceCard = newBoards[s_boardIndex].cards[s_cardIndex];

        // Create copies of the cards arrays to avoid direct mutation
        newBoards[s_boardIndex] = {
          ...newBoards[s_boardIndex],
          cards: [...newBoards[s_boardIndex].cards]
        };
        newBoards[s_boardIndex].cards.splice(s_cardIndex, 1);

        // If moving to a different board, copy its cards array too
        if (s_boardIndex !== t_boardIndex) {
          newBoards[t_boardIndex] = {
            ...newBoards[t_boardIndex],
            cards: [...newBoards[t_boardIndex].cards]
          };
        }

        newBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);

        return {
          ...project,
          boards: newBoards,
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setTargetCard({
      bid: "",
      cid: "",
    });
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid && targetCard.bid === bid) return;
    setTargetCard({
      bid,
      cid: cid || "",
    });
  };

  const updateCard = (bid, cid, card) => {
    const updatedProjects = projects.map(project => {
      if (project.id === activeProjectId) {
        return {
          ...project,
          boards: project.boards.map(board => {
            if (board.id === bid) {
              return {
                ...board,
                cards: board.cards.map(c => c.id === cid ? card : c)
              };
            }
            return board;
          })
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const moveToNextBoard = (bid, cid, cardOverride) => {
    const updatedProjects = projects.map(project => {
      if (project.id === activeProjectId) {
        const boards = [...project.boards];
        const boardIndex = boards.findIndex(b => b.id === bid);
        if (boardIndex < 0 || boardIndex === boards.length - 1) return project;

        const cardIndex = boards[boardIndex].cards.findIndex(c => c.id === cid);
        if (cardIndex < 0) return project;

        const card = cardOverride || boards[boardIndex].cards[cardIndex];

        // Remove from current board
        boards[boardIndex] = {
          ...boards[boardIndex],
          cards: boards[boardIndex].cards.filter(c => c.id !== cid)
        };

        // Add to next board
        boards[boardIndex + 1] = {
          ...boards[boardIndex + 1],
          cards: [...boards[boardIndex + 1].cards, card]
        };

        return { ...project, boards };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const moveToLastBoard = (bid, cid, cardOverride) => {
    const updatedProjects = projects.map(project => {
      if (project.id === activeProjectId) {
        const boards = [...project.boards];
        if (boards.length < 2) return project;

        const boardIndex = boards.findIndex(b => b.id === bid);
        if (boardIndex < 0) return project;

        const cardIndex = boards[boardIndex].cards.findIndex(c => c.id === cid);
        if (cardIndex < 0) return project;

        const card = cardOverride || boards[boardIndex].cards[cardIndex];
        const lastIndex = boards.length - 1;
        if (boardIndex === lastIndex) return project;

        // Remove from current board
        boards[boardIndex] = {
          ...boards[boardIndex],
          cards: boards[boardIndex].cards.filter(c => c.id !== cid)
        };
        // Add to last board (with override so completed state etc. is correct)
        boards[lastIndex] = {
          ...boards[lastIndex],
          cards: [...boards[lastIndex].cards, card]
        };

        return { ...project, boards };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const toggleProjectExpanded = (projectId) => {
    if (expandedProjects.includes(projectId)) {
      setExpandedProjects(expandedProjects.filter(id => id !== projectId));
    } else {
      setExpandedProjects([...expandedProjects, projectId]);
    }
  };

  const filteredBoards = boards.map((board) => ({
    ...board,
    cards: board.cards.filter((card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="flex w-full min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar */}
      <div className={`flex flex-col bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transition-all duration-300 relative z-50 ${sidebarCollapsed ? 'w-[70px]' : 'w-[280px]'}`}>
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 text-primary-purple">
            <LayoutGrid size={24} />
            {!sidebarCollapsed && <h2 className="text-xl font-bold bg-gradient-to-br from-primary-purple to-accent-pink bg-clip-text text-transparent">TaskFlow</h2>}
          </div>
        </div>

        {!sidebarCollapsed && (
          <>
            <div className="p-4 border-b border-gray-100 dark:border-slate-700">
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium mb-1 ${activeNav === 'kanban'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-primary-purple'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                onClick={() => setActiveNav('kanban')}
              >
                <Home size={18} />
                <span>Kanban Board</span>
              </div>
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium mb-1 ${activeNav === 'workflow'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-primary-purple'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                onClick={() => setActiveNav('workflow')}
              >
                <GitPullRequest size={18} />
                <span>Workflow Board</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-primary-purple to-accent-pink text-white rounded-full ml-auto">New</span>
              </div>
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium mb-1 ${activeNav === 'calendar'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-primary-purple'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                onClick={() => setActiveNav('calendar')}
              >
                <Calendar size={18} />
                <span>Calendar</span>
              </div>
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium mb-1 ${activeNav === 'team'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-primary-purple'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                onClick={() => setActiveNav('team')}
              >
                <Users size={18} />
                <span>Team</span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <span>Projects</span>
                <div className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  <span>{projects.length}</span>
                </div>
              </div>

              <div className="space-y-1">
                {projects.map(project => (
                  <div key={project.id} className="group">
                    <div
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium ${activeProjectId === project.id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-primary-purple' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'}`}
                      onClick={() => setActiveProjectId(project.id)}
                    >
                      <div
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProjectExpanded(project.id);
                        }}
                      >
                        {expandedProjects.includes(project.id) ?
                          <ChevronDown size={14} /> :
                          <ChevronRight size={14} />
                        }
                      </div>
                      <Folder size={16} style={{ color: project.color }} />
                      <span className="flex-1 truncate">{project.name}</span>
                      <span className="text-[10px] bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">{project.boards.length}</span>
                    </div>

                    {expandedProjects.includes(project.id) && (
                      <div className="ml-9 mt-1 space-y-1 border-l border-gray-100 dark:border-slate-700 pl-2">
                        {project.boards.map(board => (
                          <div
                            key={board.id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                            onClick={() => setActiveProjectId(project.id)}
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: board.color }}
                            />
                            <span className="flex-1 truncate">{board.title}</span>
                            <span className="text-[10px] opacity-50">{board.cards.length}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 px-2">
                <Editable
                  displayClass="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-purple dark:hover:text-primary-purple-light transition-all duration-200"
                  editClass="mt-2"
                  placeholder="Enter Project Name"
                  text={
                    <>
                      <Plus size={16} />
                      <span>New Project</span>
                    </>
                  }
                  buttonText="Create Project"
                  onSubmit={addProjectHandler}
                />
              </div>
            </div>

            <div className="p-4 mt-auto border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-all duration-200 text-sm font-medium">
                <Settings size={18} />
                <span>Settings</span>
              </div>
            </div>
          </>
        )}

        <div
          className="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full p-1 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 text-gray-400 hover:text-primary-purple z-[60]"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} className="rotate-90" />}
        </div>
      </div>

      {/* Main Content */}
      {activeNav === 'workflow' ? (
        <WorkflowView />
      ) : activeNav === 'team' ? (
        <TeamView />
      ) : activeNav === 'calendar' ? (
        <WorkflowView initialViewMode="calendar" />
      ) : (
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 z-40">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                <Folder size={20} style={{ color: activeProject?.color }} />
                <h1 className="text-xl font-bold truncate max-w-[300px]">{activeProject?.name || "Select a Project"}</h1>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <LayoutGrid size={14} />
                  <span className="font-semibold text-gray-900 dark:text-white underline underline-offset-4 decoration-primary-purple decoration-2">{boards.length}</span>
                  <span>Boards</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <ListIcon size={14} />
                  <span className="font-semibold text-gray-900 dark:text-white underline underline-offset-4 decoration-accent-green decoration-2">{boards.reduce((acc, b) => acc + b.cards.length, 0)}</span>
                  <span>Tasks</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-purple transition-colors duration-200" size={16} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-transparent focus:border-primary-purple/20 focus:bg-white dark:focus:bg-slate-600 rounded-full text-sm outline-none transition-all duration-200 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-gray-50 dark:bg-slate-700 p-1 rounded-lg">
                <button
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === "board" ? "bg-white dark:bg-slate-600 shadow-sm text-primary-purple" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                  onClick={() => setViewMode("board")}
                >
                  <LayoutGrid size={14} />
                  Board
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === "list" ? "bg-white dark:bg-slate-600 shadow-sm text-primary-purple" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                  onClick={() => setViewMode("list")}
                >
                  <ListIcon size={14} />
                  List
                </button>
              </div>
              <div
                className="p-2 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer text-gray-500 dark:text-gray-400 hover:text-primary-purple dark:hover:text-primary-purple-light transition-all duration-200"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-hidden p-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
            {activeProject ? (
              <div className="flex gap-8 h-full items-start">
                {filteredBoards.map((item, index) => (
                  <Board
                    key={item.id}
                    board={item}
                    addCard={addCardHandler}
                    removeBoard={() => removeBoard(item.id)}
                    updateBoardTitle={updateBoardTitle}
                    removeCard={removeCard}
                    dragEnded={dragEnded}
                    dragEntered={dragEntered}
                    updateCard={updateCard}
                    moveToNextBoard={moveToNextBoard}
                    moveToLastBoard={moveToLastBoard}
                    isLastBoard={index === filteredBoards.length - 1}
                  />
                ))}
                <div className="min-w-[300px]">
                  <Editable
                    displayClass="flex items-center justify-center gap-2 w-full p-4 bg-white/50 dark:bg-slate-800/50 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 dark:text-gray-400 hover:border-primary-purple hover:text-primary-purple transition-all duration-200"
                    editClass="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg"
                    placeholder="Enter Board Name"
                    text={
                      <>
                        <Plus size={20} />
                        <span className="font-semibold">Add Board</span>
                      </>
                    }
                    buttonText="Add Board"
                    onSubmit={addBoardHandler}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="p-8 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-400 dark:text-gray-600 mb-6">
                  <Folder size={80} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Project Selected</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs">Select a project from the sidebar or create a new one to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
