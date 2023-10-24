import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Command } from "../utils";
import List from "./List";

export function CommandPalette(props: { onCommand: (command: Command) => void }) {
  const allCommands: Command[] = [
    { title: "New List", hotkey: "⌘ + ⇧ + P", id: "new-list" },
    { title: "Delete List", hotkey: "-", id: "delete-list" },
    { title: "Toggle Todo", hotkey: "⌘ + Enter", id: "toggle-todo" },
  ];

  const [commands, setCommands] = useState(allCommands);
  const [focused, setFocused] = useState(-1);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      className="command-palette"
      tabIndex={-1}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key == "ArrowDown") {
          event.preventDefault();
          event.stopPropagation();
          setFocused((focused + 1) % commands.length);
        }
        if (event.key == "ArrowUp") {
          event.preventDefault();
          event.stopPropagation();
          if (focused == 0) {
            ref.current?.focus();
          } else if (focused == -1) {
            ref.current?.focus();
          } else {
            setFocused((focused - 1 + commands.length) % commands.length);
          }
        }
      }}
    >
      <input
        ref={ref}
        type="text"
        placeholder={"Search commands..."}
        onChange={(ev) => {
          setCommands(
            allCommands.filter((command) => command.title.toLowerCase().includes(ev.target.value.toLowerCase()))
          );
        }}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key == "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();
            setFocused(0);
          }
          if (event.key == "Enter") {
            props.onCommand(commands[0]);
          }
        }}
        onFocus={() => setFocused(-1)}
      />
      <List>
        {commands.map((command, idx) => (
          <List.Item
            key={command.id}
            focus={focused == idx}
            onFocus={() => setFocused(idx)}
            onSelection={() => {
              props.onCommand(command);
            }}
          >
            <div className={focused == idx ? "command focused" : "command"}>
              <div className="hotkey">{command.hotkey}</div>
              <div className="title">{command.title}</div>
            </div>
          </List.Item>
        ))}
      </List>
    </div>
  );
}
