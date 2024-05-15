// Button.js
import React from "react";

export default function Button({ onClick, type, className, children }) {
  return (
    <button onClick={onClick} type={type} className={className}>
      {children}
    </button>
  );
}