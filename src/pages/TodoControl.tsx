import { useContext, useEffect, useReducer, useState } from "react";
import { CommandPalette } from "../components/CommandPalette";
import { EntryPage } from "./EntryPage";
import { TodoListPage } from "./TodoListPage";
import { todoListReducer } from "../components/Todo/todoReducer";
import { Command, TodoList, UserAction } from "../utils";
import { Pager } from "../utils/Pager";
import { EventContext } from "../utils/events";

export function TodoControl() {
  const [todoLists, dispatch] = useReducer(
    todoListReducer,
    localStorage.getItem("todoLists") ? JSON.parse(localStorage.getItem("todoLists") || "") : []
  );

  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [onAppEvent, emitAppEvent] = useContext(EventContext);

  // Change page on todoLists change
  useEffect(() => {
    if (todoLists.length > 0) {
      setCurrentPage(2);
    } else {
      setCurrentPage(1);
    }
  }, [todoLists]);

  // Register event handlers
  useEffect(() => {
    onAppEvent("toggleCommandPalette", () => {
      setShowCommandPalette(!showCommandPalette);
    });
    onAppEvent("hideCommandPalette", () => {
      setShowCommandPalette(false);
    });
  }, [showCommandPalette]);

  function handleNoteListCreation(title: string) {
    dispatch({
      type: UserAction.Add,
      payload: { title: title },
    });
    emitAppEvent({
      name: "showHUD",
      payload: {
        title: "Welcome",
        message: "This is your first list 🎉",
      },
    });
  }

  function handleNoteListDelete(list: TodoList) {
    dispatch({
      type: UserAction.Delete,
      payload: { id: list.id },
    });
    emitAppEvent({
      name: "showHUD",
      payload: {
        title: "Went to Trash 🗑️",
        message: "",
      },
    });
  }

  function handleCommandExecution(command: Command) {
    if (command.id == "new-list") {
      const title = prompt("New Todo List Title") || "No Name";
      handleNoteListCreation(title);
      setShowCommandPalette(false);
      emitAppEvent({
        name: "showHUD",
        payload: {
          title: "New List ✅",
          message: "",
        },
      });
    }
    if (command.id == "delete-list") {
      const list = todoLists[0];
      handleNoteListDelete(list);
      setShowCommandPalette(false);
      emitAppEvent({
        name: "showHUD",
        payload: {
          title: "Went to Trash 🗑️",
          message: "",
        },
      });
    }
  }

  return (
    <Pager currentPage={currentPage}>
      <EntryPage onNoteListCreation={handleNoteListCreation}></EntryPage>
      <>
        <TodoListPage
          todoLists={todoLists}
          onTodoListCreate={handleNoteListCreation}
          onTodoListDelete={handleNoteListDelete}
        />
        {showCommandPalette && <CommandPalette onCommand={handleCommandExecution} />}
      </>
    </Pager>
  );
}
