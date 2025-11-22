import React from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import "./Operations.css";

export const Operations: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    { title: "Receipt", path: "/receipts" },
    { title: "Delivery", path: "delivery" },
    { title: "Adjustment", path: "/operations/adjustment" },
  ];

  return (
    <MainLayout title="Operations">
      <div className="operations-container">
        {cards.map((card) => (
          <div
            key={card.title}
            className="operation-card"
            onClick={() => navigate(card.path)}
          >
            <h3>{card.title}</h3>
            <p>Go to {card.title} page</p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};
