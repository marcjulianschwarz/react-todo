import { createContext } from "react";
import { MyEvent } from "../utils";

export const EventContext = createContext([(event: string, callback: Function) => {}, (event: MyEvent) => {}] as const);
