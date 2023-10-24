import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface ListProps {
  children: React.ReactNode;
  className?: string;
}

interface ListItemProps {
  children: React.ReactNode;
  focus?: boolean;
  onSelection?: () => void;
  onFocus?: () => void;
}

function handleSelectionKey(key: string, onSelection?: () => void) {
  if (key == "Enter") {
    onSelection?.();
  }
}

function ListItem(props: ListItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.focus) {
      ref.current?.focus();
    }
  }, [props.focus]);

  return (
    <div ref={ref} tabIndex={-1} className="list-item" onFocus={props.onFocus} onKeyDown={(event) => {
      handleSelectionKey(event.key, props.onSelection);
    }}>
      {props.children}
    </div>
  );
}

function List(props: ListProps) {
  return <div className={"list" + " " + props.className}>{props.children}</div>;
}

function ListItemInput(props: { defaultValue: string }) {
  return (
    <input
      type="text"
      defaultValue={props.defaultValue}
      onKeyDown={(event) => {
        if (event.key == "ArrowDown") {
          event.preventDefault();
          event.stopPropagation();
          // setFocusedIdx((focusedIdx + 1) % todos.length);
        }
      }}
    />
  );
}

ListItem.Input = ListItemInput;
List.Item = ListItem;
export default List;
