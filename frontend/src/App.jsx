import { io } from "socket.io-client";
import { Landing } from "./pages/landing";
import { Chatting } from "./pages/chatting";
import { Routes, Route } from "react-router-dom";

function App() {

  return (

    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chat" element={<Chatting />} />
    </Routes>
    
  );
}

export default App;