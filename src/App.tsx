import { useEffect, useRef, useState } from "react";
import { HUD } from "./components/HUD";
import { useHUD } from "./hooks";
import TodoList from "./TodoList";

export default function App() {
  const [todoLists, setTodoLists] = useState<string[]>([]);
  const [triggerHUD, HUDState] = useHUD();

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  });

  if (todoLists.length > 0) {
    return (
      <>
        <div
          className="todo-lists-container"
          onKeyDownCapture={(event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.metaKey && event.shiftKey && event.key == "p") {
              event.preventDefault();
              event.stopPropagation();
              setTodoLists([...todoLists, prompt("Enter a new todo list name") || "Default"]);
            }
          }}
        >
          {todoLists.map((title, idx) => {
            return <TodoList title={title} key={idx} triggerHUD={triggerHUD} />;
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
              setTodoLists([...todoLists, event.currentTarget.value]);
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
