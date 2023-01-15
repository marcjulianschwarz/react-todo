import { createContext } from "react";
import { MyEvent } from "../utils";

export const EventContext = createContext([
  (event: string, callback: (event: MyEvent) => void) => {},
  (event: MyEvent) => {},
] as const);
