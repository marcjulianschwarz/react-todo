import { KeyboardEvent, useEffect, useRef } from "react";

interface ListProps {
  children: React.ReactNode;
  className?: string;
}

interface ListItemProps {
  children: React.ReactNode;
  onFocus?: () => void;
  onSelection?: () => void;
  focus?: boolean;
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
  });

  return (
    <div
      ref={ref}
      tabIndex={-1}
      onFocus={() => {
        if (props.onFocus) {
          props.onFocus();
        }
      }}
      className="list-item"
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        handleSelectionKey(event.key, props.onSelection);
      }}
    >
      {props.children}
    </div>
  );
}

function List(props: ListProps) {
  return <div className={"list" + " " + props.className}>{props.children}</div>;
}

List.Item = ListItem;
export default List;
