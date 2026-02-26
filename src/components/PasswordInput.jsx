import React, { useState } from "react";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  name = "password",
  inputClassName,
  toggleClassName,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        className={inputClassName}
        type={visible ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className={toggleClassName}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
