import { useEffect, useRef, useState } from "react";
import { MyEvent, Unique } from "../utils";

export function useFocus<P extends Unique>() {
  // Store refs to todo items in a map from id to element
  const itemsRef = useRef<Map<string, HTMLElement>>();

  function getMap() {
    if (!itemsRef.current) {
      itemsRef.current = new Map<string, HTMLElement>();
    }
    return itemsRef.current;
  }

  // gets element from map and focuses it
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

export function useEvent() {
  const [event, setEvent] = useState<MyEvent>();
  const [callbacks, setCallbacks] = useState<Map<string, Function[]>>(new Map());

  useEffect(() => {
    if (event && callbacks.get(event.name)) {
      callbacks.get(event.name)?.forEach((callback) => {
        callback(event);
      });
    }
  }, [event]);

  function on(event: string, callback: (ev: MyEvent) => void) {
    setCallbacks((prev) => {
      const callbacks = prev.get(event) || [];
      callbacks.push(callback);
      prev.set(event, callbacks);
      return prev;
    });
  }

  function emit(ev: MyEvent) {
    setEvent(ev);
  }

  return [on, emit] as const;
}
