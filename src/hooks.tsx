import { useRef, useState } from "react";
import { Todo } from "./utils";

interface Unique {
  id: string;
}

export function useFocus<P extends Unique>() {
  // Store refs to todo items
  const itemsRef = useRef<Map<string, HTMLElement>>();

  function getMap() {
    if (!itemsRef.current) {
      itemsRef.current = new Map<string, HTMLElement>();
    }
    return itemsRef.current;
  }

  function focusElement(item: P) {
    const map = getMap();
    const el = map.get(item.id);
    if (el) {
      console.log(el);
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

  const triggerHUD = (title: string | undefined, message: string) => {
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
