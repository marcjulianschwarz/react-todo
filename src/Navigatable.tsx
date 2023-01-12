import React, { forwardRef, useRef, useState } from "react";

const Navigatable = forwardRef(
  (props: { children: React.ReactNode }, ref: React.ForwardedRef<Map<string, HTMLElement>>) => {
    ref = ref as React.MutableRefObject<Map<string, HTMLElement>>;
    const map = ref.current;
    const [currentIdx, setCurrentIdx] = useState<number>(getCurrentFocusedElement() ?? 0);

    function getCurrentFocusedElement() {
      for (let i = 0; i < (map?.size ?? 0); i++) {
        if (document.activeElement == map?.get(i.toString())) {
          return i;
        }
      }
    }

    return (
      <div
        onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
          if (event.key == "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();
            currentIdx > 0 && setCurrentIdx(currentIdx - 1);
            map?.get((currentIdx - 1).toString())?.focus();
          }
          if (event.key == "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();
            currentIdx < (map?.size ?? 0) - 1 && setCurrentIdx(currentIdx + 1);
            map?.get((currentIdx + 1).toString())?.focus();
          }
        }}
      >
        {props.children}
        <p>{currentIdx}</p>
      </div>
    );
  }
);

function useNavigatable() {
  const [refList, setRefList] = useState<React.MutableRefObject<Map<string, HTMLElement>>>(
    useRef(new Map<string, HTMLElement>())
  );
  function getMap() {
    if (!refList.current) {
      refList.current = new Map<string, HTMLElement>();
      setRefList(refList);
    }
    return refList.current;
  }

  function setMap(el: HTMLInputElement, id: string) {
    getMap().set(id, el);
  }
  return { refList, setMap };
}

export function Test() {
  const { refList, setMap } = useNavigatable();

  const [inputFields, setInputFields] = useState<string[]>(["Test", "Cool", "Wow"]);

  return (
    <Navigatable ref={refList}>
      {inputFields.map((inputField, idx) => (
        <input
          key={idx}
          ref={(el: HTMLInputElement) => {
            setMap(el, idx.toString());
          }}
          defaultValue={inputField}
        />
      ))}
      <button onClick={() => setInputFields([...inputFields, "New"])}>New</button>
    </Navigatable>
  );
}
