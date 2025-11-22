import React from "react";
import { MainLayout } from "../components/layout/MainLayout";

export const Delivery: React.FC = () => {
  return (
    <MainLayout title="Delivery">
      <div style={{ padding: "2rem" }}>
        <h1>Delivery Orders (Outgoing Stock) - Coming Soon</h1>
        <p>This page will handle outgoing stock for customer shipments.</p>
      </div>
    </MainLayout>
  );
};
