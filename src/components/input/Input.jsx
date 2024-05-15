// Input.js
import React from "react";

export function TextInput({
  label,
  id,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        type="text"
        className="form-control"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}


export function FileInput({ id, onChange, className, forwardedRef }) {
    return (
      <div className="mb-3">
        <input
          type="file"
          className={`${className} form-control`}
          id={id}
          aria-describedby={`${id}Help`}
          onChange={onChange}
          ref={forwardedRef}
        />
      </div>
    );
  }