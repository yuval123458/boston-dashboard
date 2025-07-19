import { useState } from "react";
import NavBar from "./NavBar";
import AssistantChat from "./AssistantChat";
import Dashboard from "./Dashboard";
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
