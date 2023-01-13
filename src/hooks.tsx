import { useRef, useState } from "react";
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

export function useHUD() {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [timeoutV, setTimeoutV] = useState<NodeJS.Timeout>();

  const showHUD = (message: string, title?: string) => {
    setVisible(true);
    setMessage(message);
    setTitle(title || "");
  };

  const hideHUD = () => {
    setVisible(false);
  };

  const triggerHUD = (message: string, title?: string) => {
    if (visible) {
      hideHUD();
      clearTimeout(timeoutV);
    }
    showHUD(message, title);

    const timeout = setTimeout(() => {
      hideHUD();
    }, 2000);
    setTimeoutV(timeout);
  };

  return [triggerHUD, { visible: visible, message: message, title: title }] as const;
}
