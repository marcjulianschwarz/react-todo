import { useRef } from "react";
import { Todo } from "./utils";

export function useFocus() {
  // Store refs to todo items
  const itemsRef = useRef<Map<string, HTMLElement>>();

  function getMap() {
    if (!itemsRef.current) {
      itemsRef.current = new Map<string, HTMLElement>();
    }
    return itemsRef.current;
  }

  function focusElement(todo: Todo) {
    const map = getMap();
    const el = map.get(todo.id);
    if (el) {
      el.focus();
    }
  }

  return [focusElement, getMap] as const;
}
