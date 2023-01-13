interface ClassCondition {
  condition: boolean;
  className: string;
}

export function classNameBuilder(defaultClass: string, ...classes: ClassCondition[]) {
  let className = defaultClass;
  classes.forEach((c) => {
    if (c.condition) {
      className += " " + c.className;
    }
  });
  return className;
}

export enum UserAction {
  Add,
  Delete,
  Update,
  Completed,
}

export interface Todo {
  title: string;
  completed: boolean;
  id: string;
}

export enum NavigationDirection {
  Up,
  Down,
  MouseClick,
}

export interface TodoList {
  title: string;
  todos: Todo[];
  id: string;
}

export interface Command {
  title: string;
  hotkey: string;
  id: string;
}
