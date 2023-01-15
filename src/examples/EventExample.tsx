import { useContext, useEffect, useState } from "react";
import { MyEvent } from "../utils";
import { EventContext } from "../utils/events";
import { useEvent } from "../utils/hooks";

function Example(props: {}) {
  const [count, setCount] = useState(0);
  const [on, emit] = useContext(EventContext);

  useEffect(() => {
    if (count == 5) {
      emit({ name: "count", payload: count });
    }
    if (count == 10) {
      emit({ name: "count", payload: count });
    }
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={() => emit({ name: "secret", payload: "" })}>Emit Secret</button>
    </div>
  );
}

function SecondComp() {
  const [on, emit] = useContext(EventContext);
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    console.log("Second Comp is subscribing to count event");
    on("count", (payload: any) => {
      setShowMessage(true);
      if (payload.payload == 10) {
        setShowMessage(false);
      }
    });
  }, []);
  return (showMessage && <div>Got count</div>) || <div>Waiting for count</div>;
}

function ThirdComp() {
  const [on, emit] = useContext(EventContext);
  const [showMessage, setShowMessage] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log("Third Comp is subscribing to countTen event");
    on("count", (payload: any) => {
      if (payload.payload == 10) {
        setShowMessage(true);
        setCount(payload.payload);
      }
    });
  }, []);
  return (
    (showMessage && <div style={{ backgroundColor: "red" }}>Got count {count}</div>) || <div>Waiting for count</div>
  );
}

function ForthComp(props: { children: React.ReactNode }) {
  return <div>{props.children}</div>;
}

function FithComp() {
  const [on, emit] = useContext(EventContext);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    console.log("Fifth Comp is subscribing to count event");
    on("secret", (event: MyEvent) => {
      setShowMessage(true);
    });
  }, []);

  return (
    <div>
      <h1>Test</h1>
      {showMessage && <h2>Secret Message is here</h2>}
    </div>
  );
}

export function EventExample() {
  const [on, emit] = useEvent();

  return (
    <EventContext.Provider value={[on, emit] as const}>
      <div>
        <Example></Example>
        <SecondComp></SecondComp>
        <ThirdComp></ThirdComp>
        <ForthComp>
          <FithComp></FithComp>
        </ForthComp>
      </div>
    </EventContext.Provider>
  );
}
