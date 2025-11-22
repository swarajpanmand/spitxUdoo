import React from "react";
import { MainLayout } from "../components/layout/MainLayout";

export const Adjustment: React.FC = () => {
  return (
    <MainLayout title="Adjustment">
      <div style={{ padding: "2rem" }}>
        <h1>Inventory Adjustment - Coming Soon</h1>
        <p>
          This page will handle stock adjustments and physical count
          corrections.
        </p>
      </div>
    </MainLayout>
  );
};
