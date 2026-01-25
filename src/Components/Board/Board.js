import React, { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import Editable from "../Editabled/Editable";

import "./Board.css";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  const cardCount = props.board?.cards?.length || 0;

  return (
    <div className="board">
      <div className="board_header">
        <div className="board_header_left">
          <div
            className="board_color_dot"
            style={{ backgroundColor: props.board?.color }}
          />
          <div className="board_header_info">
            <p className="board_header_title">{props.board?.title}</p>
            <span className="board_header_count">{cardCount} {cardCount === 1 ? 'task' : 'tasks'}</span>
          </div>
        </div>
        <div
          className="board_header_actions"
          onClick={() => setShowDropdown(true)}
        >
          <MoreHorizontal size={18} />
          {showDropdown && (
            <Dropdown
              class="board_dropdown"
              onClose={() => setShowDropdown(false)}
            >
              <div className="dropdown_item danger" onClick={() => props.removeBoard()}>
                Delete Board
              </div>
            </Dropdown>
          )}
        </div>
      </div>

      <div className="board_cards custom-scroll">
        {props.board?.cards?.map((item) => (
          <Card
            key={item.id}
            card={item}
            boardId={props.board.id}
            removeCard={props.removeCard}
            dragEntered={props.dragEntered}
            dragEnded={props.dragEnded}
            updateCard={props.updateCard}
          />
        ))}

        <Editable
          text={
            <div className="board_add_card_content">
              <Plus size={16} />
              <span>Add Task</span>
            </div>
          }
          placeholder="Enter task title..."
          displayClass="board_add-card"
          editClass="board_add-card_edit"
          onSubmit={(value) => props.addCard(props.board?.id, value)}
        />
      </div>
    </div>
  );
}

export default Board;
