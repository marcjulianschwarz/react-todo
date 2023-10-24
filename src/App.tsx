import { TodoControl } from "./pages/TodoControl";
import { HUD } from "./components/HUD";
import { useEvent, useHUD } from "./utils/hooks";
import { useEffect, useRef } from "react";
import { MyEvent } from "./utils";
import { EventContext } from "./utils/events";


export default function App() {
  const [triggerHUD, HUDState] = useHUD();

  const [onAppEvent, emitAppEvent] = useEvent();
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onAppEvent("showHUD", (e: MyEvent) => {
      triggerHUD(e.payload.title, e.payload.message);
    });
  }, []);

  // Register keyboard event handlers
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key == "Escape") {
        emitAppEvent({
          name: "hideCommandPalette",
          payload: {},
        });
      }
      if (e.metaKey && e.key == "k") {
        e.preventDefault();
        e.stopPropagation();
        emitAppEvent({
          name: "toggleCommandPalette",
          payload: {},
        });
      }
    });
    return () => {
      window.removeEventListener("keydown", () => {});
    };
  }, []);

  // return <MyTodoList></MyTodoList>;

  return (
    <EventContext.Provider value={[onAppEvent, emitAppEvent]}>
      <div className="app" tabIndex={-1} ref={appRef}>
        <TodoControl appRef={appRef}></TodoControl>
        <HUD title={HUDState.title} message={HUDState.message} visible={HUDState.visible}></HUD>
      </div>
    </EventContext.Provider>
  );
}
