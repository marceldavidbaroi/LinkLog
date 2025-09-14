import React from "react";

interface KpiCardProps {
  title: string;
  value: number;
  color: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, color }) => {
  return (
    <div
      style={{
        background: color,
        borderRadius: "10px",
        padding: "1rem 1.5rem",
        minWidth: "120px",
        textAlign: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h4 style={{ margin: "0 0 0.3rem 0", color: "#333" }}>{title}</h4>
      <p
        style={{
          margin: 0,
          fontWeight: "bold",
          fontSize: "1.2rem",
          color: "#333",
        }}
      >
        {value.toFixed(2)}
      </p>
    </div>
  );
};

interface KpiCardsProps {
  kpis: { title: string; value: number; color: string }[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "2rem",
      }}
    >
      {kpis.map((kpi) => (
        <KpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
};
