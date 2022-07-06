import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Lobby, Room } from "@pages";
import GlobalStyle from "@src/GlobalStyle";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Lobby />} />
          <Route path='room:roomCode' element={<Room />} />
          <Route path='*' element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
