import React, { useEffect, useReducer, useRef, useState } from "react";
import { useFocus } from "./hooks";
import { todoReducer } from "./todoReducer";
import { classNameBuilder, NavigationDirection, Todo, UserAction } from "./utils";
import { TodoListItem } from "./TodoListItem";

export default function TodoList(props: { title: string }) {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [focusElement, getMap] = useFocus();
  const [showCompleted, setShowCompleted] = useState<Todo>();
  const [currentPosition, setCurrentPosition] = useState(-1);

  // Show completed "modal" for two seconds
  useEffect(() => {
    if (showCompleted) {
      setInterval(() => {
        setShowCompleted(undefined);
      }, 5000);
    }
  }, [showCompleted]);

  // Setting focus to new todo input
  const newTodoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentPosition == -1) {
      newTodoInput.current?.focus();
    } else {
      focusElement(todos[currentPosition]);
    }
  }, [currentPosition]);

  function handleDeleteTodo(todo: Todo, moveTo: number) {
    dispatch({
      type: UserAction.Delete,
      payload: { todo: todo },
    });
    if (moveTo < 0) {
      newTodoInput.current?.focus();
    }
    setCurrentPosition(currentPosition - 1);
  }

  function handleAddTodo(title: string) {
    dispatch({
      type: UserAction.Add,
      payload: { title: title },
    });
  }

  function handleUpdateTodo(todo: Todo, moveTo: number) {
    dispatch({
      type: UserAction.Update,
      payload: { todo: todo },
    });
    console.log(moveTo);
    if (moveTo < 0) {
      moveTo = 0;
    } else if (moveTo >= todos.length) {
      newTodoInput.current?.focus();
    } else {
      focusElement(todos[moveTo]);
    }
  }

  function handleCompleted(todo: Todo) {
    dispatch({
      type: UserAction.Completed,
      payload: { todo: todo },
    });
    if (todo.completed) {
      setShowCompleted(todo);
    }
  }

  function addRefToMap(todo: Todo, el: HTMLInputElement) {
    const map = getMap();
    if (!el) {
      map.delete(todo.id);
    } else {
      map.set(todo.id, el);
    }
  }

  function handleNavigation(direction: NavigationDirection, idx: number) {
    switch (direction) {
      case NavigationDirection.Up:
        if (currentPosition > 0) {
          setCurrentPosition(currentPosition - 1);
        }
        break;
      case NavigationDirection.Down:
        if (currentPosition < todos.length - 1) {
          setCurrentPosition(currentPosition + 1);
        }
        if (currentPosition == todos.length - 1) {
          setCurrentPosition(-1);
        }
        break;
      case NavigationDirection.MouseClick:
        setCurrentPosition(idx);
        break;
    }
  }

  const completedTodos = todos.filter((t: Todo) => t.completed);
  const allCompleted = completedTodos.length == todos.length && todos.length > 0;
  const titleClassName = classNameBuilder("todo-list-title", { condition: allCompleted, className: "all-completed" });

  return (
    <div className="todo-list">
      <span>{currentPosition}</span>
      <span className={titleClassName}>
        {props.title} - {completedTodos.length} / {todos.length}
      </span>

      <ul>
        {todos.map((todo, idx) => {
          return (
            <>
              <TodoListItem
                key={todo.id}
                todo={todo}
                onRemoveTodo={(todo: Todo) => handleDeleteTodo(todo, idx - 1)}
                onUpdateTodo={(todo: Todo) => handleUpdateTodo(todo, idx + 1)}
                onCompleted={handleCompleted}
                onNavigation={(direction: NavigationDirection) => handleNavigation(direction, idx)}
                onInit={addRefToMap}
              />
              <hr className={idx == currentPosition ? "selected" : ""}></hr>
            </>
          );
        })}
        <li>
          <input
            type="text"
            ref={newTodoInput}
            className="text-box"
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key == "Enter") {
                handleAddTodo(event.currentTarget.value);
                event.currentTarget.value = "";
              }
              if (event.key == "Backspace" && event.currentTarget.value == "" && todos.length > 0) {
                event.preventDefault();
                event.stopPropagation();
                setCurrentPosition(todos.length - 1);
              }
              if (event.key == "ArrowUp") {
                event.preventDefault();
                event.stopPropagation();
                setCurrentPosition(todos.length - 1);
              }
            }}
          />
        </li>
      </ul>
      {showCompleted && <span>Completed {showCompleted.title} 🎉</span>}
    </div>
  );
}
