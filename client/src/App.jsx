import React from "react";
import "./App.css";
import Login from "./pages/login";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/student/HeroSection";

const App = () => {
  return (
    <>
      <main>
        <Navbar />
        <HeroSection />
        <Login />
      </main>
    </>
  );
};

export default App;
