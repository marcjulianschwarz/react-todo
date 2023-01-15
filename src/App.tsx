import { TodoControl } from "./pages/TodoControl";
import { HUD } from "./components/HUD";
import { useEvent, useHUD } from "./utils/hooks";
import { useEffect } from "react";
import { MyEvent } from "./utils";
import { EventContext } from "./utils/events";

export default function App() {
  const [triggerHUD, HUDState] = useHUD();

  const [onAppEvent, emitAppEvent] = useEvent();

  useEffect(() => {
    onAppEvent("showHUD", (e: MyEvent) => {
      triggerHUD(e.payload.title, e.payload.message);
    });
  }, []);

  return (
    <EventContext.Provider value={[onAppEvent, emitAppEvent]}>
      <div
        className="app"
        tabIndex={-1}
        onKeyDown={(e) => {
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
        }}
      >
        <TodoControl></TodoControl>
        <HUD title={HUDState.title} message={HUDState.message} visible={HUDState.visible}></HUD>
      </div>
    </EventContext.Provider>
  );
}
