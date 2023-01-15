import { Todo, TodoList, UserAction } from "../../utils";

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
      const newTodos = [...todos, { title: action.payload.title, completed: false, id: crypto.randomUUID() }];
      return newTodos;
    }
    case UserAction.Delete: {
      console.log("Delete todo " + action.payload.todo.title);
      const newTodos = todos.filter((t: Todo) => t.id != action.payload.todo.id);
      return newTodos;
    }
    case UserAction.Update: {
      console.log("Update todo " + action.payload.todo.title);
      const updatedTodos = updateTodo(todos, action.payload.todo);
      return updatedTodos;
    }
    case UserAction.Completed: {
      console.log("Completed todo " + (action.payload.todo.completed ? "✅" : "❌"));
      const updatedTodos = updateTodo(todos, action.payload.todo);
      return updatedTodos;
    }
    default:
      console.log("The action is not supported");
      return todos;
  }
}

type TodoListReducerAction =
  | { type: UserAction.Add; payload: { title: string } }
  | { type: UserAction.Delete; payload: { id: string } };

export function todoListReducer(todoLists: TodoList[], action: TodoListReducerAction) {
  switch (action.type) {
    case UserAction.Add: {
      console.log("Add todolist " + action.payload.title);
      const newTodoLists = [...todoLists, { title: action.payload.title, todos: [], id: crypto.randomUUID() }];
      localStorage.setItem("todoLists", JSON.stringify(newTodoLists));
      return newTodoLists;
    }
    case UserAction.Delete: {
      console.log("Delete todolist " + action.payload.id);
      const newTodoLists = todoLists.filter((t: TodoList) => t.id != action.payload.id);
      localStorage.setItem("todoLists", JSON.stringify(newTodoLists));
      return newTodoLists;
    }
    default:
      console.log("The action is not supported");
      return todoLists;
  }
}
