import { useState } from "react";
import { Pager } from "../utils/Pager";

export function SomePage(props: { changePage: (page: number) => void }) {
  return (
    <div>
      <h2>Test</h2>
      <button onClick={() => props.changePage(2)}>Go to page 2</button>
    </div>
  );
}

export function SomeOtherPage(props: { changePage: (page: number) => void }) {
  return (
    <div>
      <h2>Test 2</h2>
      <button onClick={() => props.changePage(1)}>Go to page 1</button>
    </div>
  );
}

export default function PagerExample() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Pager currentPage={currentPage}>
      <SomePage changePage={setCurrentPage} />
      <SomeOtherPage changePage={setCurrentPage} />
    </Pager>
  );
}
