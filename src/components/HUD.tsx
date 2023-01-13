import { createPortal } from "react-dom";

export function HUD(props: { title?: string; message: string; visible?: boolean }) {
  return createPortal(
    <div className={"HUD" + (props.visible ? "" : " hide")}>
      <div className="content">
        {props.title && <span className="title">{props.title}</span>}
        {props.message != "" && <span className="message">{props.message}</span>}
      </div>
    </div>,
    document.getElementById("HUD-root") as HTMLElement
  );
}
