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
  Users
} from "lucide-react";

import Board from "./Components/Board/Board";
import Editable from "./Components/Editabled/Editable";

import "./App.css";

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

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
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
    const updatedProjects = projects.map(project => {
      if (project.id === activeProjectId) {
        const newBoards = [...project.boards];

        const s_boardIndex = newBoards.findIndex(item => item.id === bid);
        if (s_boardIndex < 0) return project;

        const s_cardIndex = newBoards[s_boardIndex]?.cards?.findIndex(
          item => item.id === cid
        );
        if (s_cardIndex < 0) return project;

        const t_boardIndex = newBoards.findIndex(item => item.id === targetCard.bid);
        if (t_boardIndex < 0) return project;

        const t_cardIndex = newBoards[t_boardIndex]?.cards?.findIndex(
          item => item.id === targetCard.cid
        );
        if (t_cardIndex < 0) return project;

        const sourceCard = newBoards[s_boardIndex].cards[s_cardIndex];
        newBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
        newBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);

        return {
          ...project,
          boards: newBoards
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setTargetCard({ bid: "", cid: "" });
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({ bid, cid });
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
    <div className="app">
      {/* Sidebar */}
      <div className={`app_sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar_header">
          <div className="sidebar_logo">
            <LayoutGrid size={24} />
            {!sidebarCollapsed && <h2>TaskFlow</h2>}
          </div>
        </div>

        {!sidebarCollapsed && (
          <>
            <div className="sidebar_nav">
              <div className="sidebar_nav_item active">
                <Home size={18} />
                <span>Home</span>
              </div>
              <div className="sidebar_nav_item">
                <Calendar size={18} />
                <span>Calendar</span>
              </div>
              <div className="sidebar_nav_item">
                <Users size={18} />
                <span>Team</span>
              </div>
            </div>

            <div className="sidebar_section">
              <div className="sidebar_section_header">
                <span>Projects</span>
                <div className="sidebar_stats">
                  <span>{projects.length}</span>
                </div>
              </div>

              <div className="sidebar_projects">
                {projects.map(project => (
                  <div key={project.id} className="sidebar_project">
                    <div
                      className={`sidebar_project_header ${activeProjectId === project.id ? 'active' : ''}`}
                      onClick={() => setActiveProjectId(project.id)}
                    >
                      <div
                        className="sidebar_project_toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProjectExpanded(project.id);
                        }}
                      >
                        {expandedProjects.includes(project.id) ?
                          <ChevronDown size={16} /> :
                          <ChevronRight size={16} />
                        }
                      </div>
                      <Folder size={16} style={{ color: project.color }} />
                      <span className="sidebar_project_name">{project.name}</span>
                      <span className="sidebar_project_count">{project.boards.length}</span>
                    </div>

                    {expandedProjects.includes(project.id) && (
                      <div className="sidebar_project_boards">
                        {project.boards.map(board => (
                          <div
                            key={board.id}
                            className="sidebar_board_item"
                            onClick={() => setActiveProjectId(project.id)}
                          >
                            <div
                              className="board_color_indicator"
                              style={{ backgroundColor: board.color }}
                            />
                            <span>{board.title}</span>
                            <span className="board_card_count">{board.cards.length}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="sidebar_add_project">
                <Editable
                  displayClass="sidebar_add_project_btn"
                  editClass="sidebar_add_project_edit"
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

            <div className="sidebar_footer">
              <div className="sidebar_nav_item">
                <Settings size={18} />
                <span>Settings</span>
              </div>
            </div>
          </>
        )}

        <div
          className="sidebar_collapse_btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Main Content */}
      <div className="app_main">
        <div className="app_nav">
          <div className="app_nav_left">
            <div className="app_nav_breadcrumb">
              <Folder size={20} style={{ color: activeProject?.color }} />
              <h1>{activeProject?.name || "Select a Project"}</h1>
            </div>
            <div className="app_stats">
              <div className="stat_item">
                <LayoutGrid size={16} />
                <span className="stat_value">{boards.length}</span>
                <span>Boards</span>
              </div>
              <div className="stat_item">
                <ListIcon size={16} />
                <span className="stat_value">{boards.reduce((acc, b) => acc + b.cards.length, 0)}</span>
                <span>Tasks</span>
              </div>
            </div>
          </div>
          <div className="app_nav_actions">
            <div className="app_nav_search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="view_toggle">
              <button
                className={viewMode === "board" ? "active" : ""}
                onClick={() => setViewMode("board")}
              >
                <LayoutGrid size={16} />
                Board
              </button>
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
              >
                <ListIcon size={16} />
                List
              </button>
            </div>
            <div className="theme_toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </div>
          </div>
        </div>

        <div className="app_boards_container">
          {activeProject ? (
            <div className="app_boards">
              {filteredBoards.map((item) => (
                <Board
                  key={item.id}
                  board={item}
                  addCard={addCardHandler}
                  removeBoard={() => removeBoard(item.id)}
                  removeCard={removeCard}
                  dragEnded={dragEnded}
                  dragEntered={dragEntered}
                  updateCard={updateCard}
                />
              ))}
              <div className="app_boards_last">
                <Editable
                  displayClass="app_boards_add-board"
                  editClass="app_boards_add-board_edit"
                  placeholder="Enter Board Name"
                  text={
                    <>
                      <Plus size={20} />
                      <span>Add Board</span>
                    </>
                  }
                  buttonText="Add Board"
                  onSubmit={addBoardHandler}
                />
              </div>
            </div>
          ) : (
            <div className="empty_state">
              <Folder size={80} />
              <h2>No Project Selected</h2>
              <p>Select a project from the sidebar or create a new one to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
