import React from "react";

interface ViewSelectorProps {
  view: string;
  setView: (view: "summary" | "category" | "full") => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  view,
  setView,
}) => {
  const buttons = [
    { label: "Summary", value: "summary" },
    { label: "Category Summary", value: "category" },
    { label: "Full Categories", value: "full" },
  ];

  return (
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      {buttons.map((btn) => (
        <button
          key={btn.value}
          onClick={() => setView(btn.value as any)}
          style={{
            padding: "0.5rem 1rem",
            marginRight: "0.5rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: view === btn.value ? "#8884d8" : "#e0e0e0",
            color: view === btn.value ? "#fff" : "#333",
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};
