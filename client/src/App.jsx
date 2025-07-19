import { useState } from "react";
import NavBar from "./components/NavBar";
import AssistantChat from "./components/AssistantChat";
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
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
