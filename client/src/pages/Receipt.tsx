import React from "react";
import { MainLayout } from "../components/layout/MainLayout";

export const Receipt: React.FC = () => {
  return (
    <MainLayout title="Receipt">
      <div style={{ padding: "2rem" }}>
        <h1>Receipt (Incoming Stock) - Coming Soon</h1>
        <p>This page will handle incoming stock from vendors.</p>
      </div>
    </MainLayout>
  );
};
