import React, { useEffect, useState } from "react";
import { Search, Moon, Sun, LayoutGrid, List as ListIcon, Plus } from "lucide-react";

import Board from "./Components/Board/Board";
import Editable from "./Components/Editabled/Editable";

import "./App.css";

function App() {
  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem("prac-kanban")) || []
  );

  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("board"); // board or list

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const addboardHandler = (name) => {
    const tempBoards = [...boards];
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
      color: getRandomBoardColor(),
    });
    setBoards(tempBoards);
  };

  const getRandomBoardColor = () => {
    const colors = [
      "#7b68ee",
      "#ff6b9d",
      "#49ccf9",
      "#00d4aa",
      "#ffa800",
      "#ff6b6b",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const removeBoard = (id) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards.splice(index, 1);
    setBoards(tempBoards);
  };

  const addCardHandler = (id, title) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards[index].cards.push({
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: "",
      tasks: [],
      priority: "medium",
      assignees: [],
      description: "",
    });
    setBoards(tempBoards);
  };

  const removeCard = (bid, cid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoards);
  };

  const dragEnded = (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boards.findIndex((item) => item.id === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    if (t_boardIndex < 0) return;

    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );
    if (t_cardIndex < 0) return;

    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoards(tempBoards);

    setTargetCard({
      bid: "",
      cid: "",
    });
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const updateCard = (bid, cid, card) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;

    setBoards(tempBoards);
  };

  const filteredBoards = boards.map((board) => ({
    ...board,
    cards: board.cards.filter((card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  useEffect(() => {
    localStorage.setItem("prac-kanban", JSON.stringify(boards));
  }, [boards]);

  const totalCards = boards.reduce((acc, board) => acc + board.cards.length, 0);
  const completedTasks = boards.reduce((acc, board) => {
    return (
      acc +
      board.cards.reduce((cardAcc, card) => {
        return (
          cardAcc +
          (card.tasks?.filter((task) => task.completed).length || 0)
        );
      }, 0)
    );
  }, 0);

  return (
    <div className="app">
      <div className="app_nav">
        <div className="app_nav_left">
          <h1>TaskFlow</h1>
          <div className="app_stats">
            <div className="stat_item">
              <LayoutGrid />
              <span className="stat_value">{boards.length}</span>
              <span>Boards</span>
            </div>
            <div className="stat_item">
              <ListIcon />
              <span className="stat_value">{totalCards}</span>
              <span>Tasks</span>
            </div>
          </div>
        </div>
        <div className="app_nav_actions">
          <div className="app_nav_search">
            <Search />
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
              <LayoutGrid style={{ width: 16, height: 16, marginRight: 4 }} />
              Board
            </button>
            <button
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
            >
              <ListIcon style={{ width: 16, height: 16, marginRight: 4 }} />
              List
            </button>
          </div>
          <div className="theme_toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun /> : <Moon />}
          </div>
        </div>
      </div>
      <div className="app_boards_container">
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
                  <Plus />
                  <span>Add Board</span>
                </>
              }
              buttonText="Add Board"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

