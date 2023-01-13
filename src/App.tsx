import { useReducer, useState } from "react";
import { CommandPalette } from "./components/CommandPalette";
import { HUD } from "./components/HUD";
import { useHUD } from "./hooks";
import { EntryPage } from "./pages/EntryPage";
import { TodoListPage } from "./pages/TodoListPage";
import { todoListReducer } from "./todoReducer";
import { Command, TodoList, UserAction } from "./utils";

export default function App() {
  const [todoLists, dispatch] = useReducer(
    todoListReducer,
    localStorage.getItem("todoLists") ? JSON.parse(localStorage.getItem("todoLists") || "") : []
  );
  const [triggerHUD, HUDState] = useHUD();
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  function handleNoteListCreation(title: string) {
    dispatch({
      type: UserAction.Add,
      payload: { title: title },
    });
  }

  function handleNoteListDelete(list: TodoList) {
    dispatch({
      type: UserAction.Delete,
      payload: { id: list.id },
    });
  }

  return (
    <div
      className="app"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key == "Escape") {
          setShowCommandPalette(false);
        }
        if (e.metaKey && e.key == "k") {
          setShowCommandPalette(!showCommandPalette);
        }
      }}
    >
      {todoLists.length > 0 ? (
        <>
          <TodoListPage
            todoLists={todoLists}
            onTodoListCreate={handleNoteListCreation}
            onTodoListDelete={handleNoteListDelete}
            triggerHUD={triggerHUD}
          ></TodoListPage>

          {showCommandPalette && (
            <CommandPalette
              onCommand={(command: Command) => {
                if (command.id == "new-list") {
                  const title = prompt("New Todo List Title") || "No Name";
                  handleNoteListCreation(title);
                  setShowCommandPalette(false);
                  triggerHUD("New List ✅", "");
                }
                if (command.id == "delete-list") {
                  const list = todoLists[0];
                  handleNoteListDelete(list);
                  setShowCommandPalette(false);
                  triggerHUD("Went to Trash 🗑️", "");
                }
              }}
            />
          )}
        </>
      ) : (
        <EntryPage onNoteListCreation={handleNoteListCreation}></EntryPage>
      )}
      <HUD title={HUDState.title} message={HUDState.message} visible={HUDState.visible}></HUD>
    </div>
  );
}
