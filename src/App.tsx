import { useEffect, useRef, useState } from "react";
import TodoList from "./TodoList";

export default function App() {
  const [todoLists, setTodoLists] = useState<string[]>([]);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  });

  if (todoLists.length > 0) {
    return (
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
          return <TodoList title={title} key={idx} />;
        })}
      </div>
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
      </div>
    );
  }
}
