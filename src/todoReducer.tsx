import { Todo, UserAction } from "./utils";

type TodoReducerAction =
  | { type: UserAction.Add; payload: { title: string } }
  | { type: UserAction.Delete; payload: { todo: Todo } }
  | { type: UserAction.Update; payload: { todo: Todo } }
  | { type: UserAction.Completed; payload: { todo: Todo } };

function updateTodo(todos: Todo[], todo: Todo) {
  return todos.map((t: Todo) => {
    if (t.id == todo.id) {
      return todo;
    }
    return t;
  });
}

export function todoReducer(todos: Todo[], action: TodoReducerAction) {
  switch (action.type) {
    case UserAction.Add: {
      console.log("Add " + action.payload.title);
      return [...todos, { title: action.payload.title, completed: false, id: crypto.randomUUID() }];
    }
    case UserAction.Delete: {
      console.log("Delete " + action.payload.todo.title);
      return todos.filter((t: Todo) => t.id != action.payload.todo.id);
    }
    case UserAction.Update: {
      console.log("Update " + action.payload.todo.title);
      return updateTodo(todos, action.payload.todo);
    }
    case UserAction.Completed: {
      console.log("Completed " + (action.payload.todo.completed ? "✅" : "❌"));
      return updateTodo(todos, action.payload.todo);
    }
    default:
      console.log("The action is not supported");
      return todos;
  }
}
