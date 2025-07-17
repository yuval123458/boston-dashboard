import { useState } from "react";
import "./App.css";
import NavBar from "./NavBar";
import AssistantChat from "./AssistantChat";
import Dashboard from "./Dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/Dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assistant" element={<AssistantChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
