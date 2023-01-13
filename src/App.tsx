import { ChangeEvent, forwardRef, KeyboardEvent, Ref, useEffect, useReducer, useRef, useState } from "react";
import { CommandPalette } from "./components/CommandPalette";
import { HUD } from "./components/HUD";
import { useFocus, useHUD } from "./hooks";
import TodoListComponent from "./TodoList";
import { todoListReducer } from "./todoReducer";
import { Command, NavigationDirection, TodoList, UserAction } from "./utils";

export default function App() {
  const [todoLists, dispatch] = useReducer(
    todoListReducer,
    localStorage.getItem("todoLists") ? JSON.parse(localStorage.getItem("todoLists") || "") : []
  );
  const [triggerHUD, HUDState] = useHUD();
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  });

  if (todoLists.length > 0) {
    return (
      <>
        {showCommandPalette && (
          <CommandPalette
            onCommand={(command: Command) => {
              if (command.id == "new-list") {
                const title = prompt("New Todo List Title") || "No Name";
                dispatch({
                  type: UserAction.Add,
                  payload: { title: title },
                });
                triggerHUD("New List ✅", "");
              }
              if (command.id == "delete-list") {
                dispatch({
                  type: UserAction.Delete,
                  payload: { id: todoLists[0].id },
                });
              }
            }}
          ></CommandPalette>
        )}
        <div
          className="todo-lists-container"
          onKeyDownCapture={(event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.metaKey && event.shiftKey && event.key == "p") {
              event.preventDefault();
              event.stopPropagation();
              const title = prompt("New Todo List Title") || "No Name";
              dispatch({
                type: UserAction.Add,
                payload: { title: title },
              });

              triggerHUD("New List ✅", "");
            }
            if (event.metaKey && event.key == "k") {
              setShowCommandPalette(!showCommandPalette);
            }
          }}
        >
          {todoLists.map((todoList: TodoList) => {
            return (
              <TodoListComponent
                todoList={todoList}
                key={todoList.id}
                triggerHUD={triggerHUD}
                handleListDelete={(list: TodoList) => dispatch({ type: UserAction.Delete, payload: { id: list.id } })}
              />
            );
          })}
        </div>
        <HUD title={HUDState.title} message={HUDState.message} visible={HUDState.visible}></HUD>
      </>
    );
  } else {
    return (
      <div className="first-note-list-creation-container">
        <input
          type="text"
          ref={firstInputRef}
          placeholder="First Todo List"
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key == "Enter") {
              dispatch({
                type: UserAction.Add,
                payload: { title: event.currentTarget.value },
              });
              event.currentTarget.value = "";
            }
          }}
        ></input>
        <div className="intro">
          <div className="intro-row">
            <div className="shortcut">
              <span className="key">⌘</span>
              <span> + </span>
              <span className="key">⇧</span>
              <span> + </span>
              <span className="key">P</span>
            </div>
            <div className="description">New Todo List</div>
          </div>
          <div className="intro-row">
            <div className="shortcut">
              <span className="key">⌘</span>
              <span> + </span>
              <span className="key">Enter</span>
            </div>
            <div className="description">
              <span>Complete Todo</span>
            </div>
          </div>
          <div className="intro-row">
            <div className="shortcut">
              <span className="key">↑</span>
              <span> or </span>
              <span className="key">↓</span>
            </div>
            <div className="description">
              <span>Navigation</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
