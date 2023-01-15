import React, { Children } from "react";

export function Pager(props: { children: React.ReactNode; currentPage: number }) {
  const childrenArray = React.Children.toArray(props.children);

  return (
    <>
      {Children.map(childrenArray, (child, index) => {
        if (index + 1 === props.currentPage) {
          return child;
        }
      })}
    </>
  );
}
