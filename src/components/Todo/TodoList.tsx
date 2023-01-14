import React, { useEffect, useReducer, useRef, useState } from "react";
import { useFocus } from "../../utils/hooks";
import { todoReducer } from "./todoReducer";
import { classNameBuilder, NavigationDirection, Todo, TodoList, UserAction } from "../../utils";
import { TodoListItem } from "./TodoListItem";

export default function TodoListComponent(props: {
  todoList: TodoList;
  triggerHUD: (title: string | undefined, message: string) => void;
  handleListDelete: (list: TodoList) => void;
}) {
  const [todos, dispatch] = useReducer(todoReducer, props.todoList.todos);
  const [focusElement, getMap] = useFocus<Todo>();
  const [currentPosition, setCurrentPosition] = useState(-1);

  // Setting focus to new todo input
  const newTodoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentPosition == -1) {
      newTodoInput.current?.focus();
    } else {
      focusElement(todos[currentPosition]);
    }
  }, [currentPosition]);

  // Updating localStorage on todos change
  useEffect(() => {
    const lists = localStorage.getItem("todoLists");
    if (lists) {
      const todoLists = JSON.parse(lists) as TodoList[];
      const updatedTodoList = todoLists.find((list) => list.id == props.todoList.id);
      if (updatedTodoList) {
        updatedTodoList.todos = todos;
      }
      localStorage.setItem("todoLists", JSON.stringify(todoLists));
    }
  }, [todos]);

  function completedTodos() {
    return todos.filter((todo) => todo.completed).length;
  }

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
    const completed = completedTodos();
    if (completed == todos.length) {
      props.triggerHUD("", "All done! 🎉");
    } else {
      if (todo.completed) {
        props.triggerHUD("", "Completed" + " 🎉  " + (todos.length - completed) + " more to go");
      }
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

  const allCompleted = completedTodos() == todos.length && todos.length > 0;
  const titleClassName = classNameBuilder("title", { condition: allCompleted, className: "all-completed" });

  return (
    <div className="todo-list">
      <div className="header">
        <span className={titleClassName}>
          {props.todoList.title} - {completedTodos()} / {todos.length}
        </span>
        <span className="delete" onClick={() => props.handleListDelete(props.todoList)}>
          Delete
        </span>
      </div>
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
            key="new-todo"
            ref={newTodoInput}
            className="text-box"
            onFocusCapture={() => setCurrentPosition(-1)}
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
    </div>
  );
}
