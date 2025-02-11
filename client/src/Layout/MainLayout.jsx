import Navbar from "@/components/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </main>
    </>
  );
};

export default MainLayout;
