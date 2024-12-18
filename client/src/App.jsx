import React from "react";
import "./App.css";
import Login from "./pages/login";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <main>
        <Navbar />
        <Login />
      </main>
    </>
  );
};

export default App;
