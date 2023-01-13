import { useEffect, useRef } from "react";

export function EntryPage(props: { onNoteListCreation: (title: string) => void }) {
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  });

  return (
    <div className="first-note-list-creation-container">
      <input
        type="text"
        ref={firstInputRef}
        placeholder="First Todo List"
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key == "Enter") {
            props.onNoteListCreation(event.currentTarget.value);
            event.currentTarget.value = "";
          }
        }}
      ></input>
      <div className="intro">
        <div className="intro-row">
          <div className="shortcut">
            <span className="key">⌘</span>
            <span> + </span>
            <span className="key">K</span>
          </div>
          <div className="description">Command Palette</div>
        </div>
        <div className="intro-row">
          <div className="shortcut">
            <span className="key">⌘</span>
            <span> + </span>
            <span className="key">⇧</span>
            <span> + </span>
            <span className="key">P</span>
          </div>
          <div className="description">New Todo List</div>
        </div>
        <div className="intro-row">
          <div className="shortcut">
            <span className="key">⌘</span>
            <span> + </span>
            <span className="key">Enter</span>
          </div>
          <div className="description">
            <span>Complete Todo</span>
          </div>
        </div>
        <div className="intro-row">
          <div className="shortcut">
            <span className="key">↑</span>
            <span> or </span>
            <span className="key">↓</span>
          </div>
          <div className="description">
            <span>Navigation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
