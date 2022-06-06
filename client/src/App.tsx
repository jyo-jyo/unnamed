import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Lobby />} />
          <Route path='room:roomCode' element={<Room />} />
          <Route path='*' element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
