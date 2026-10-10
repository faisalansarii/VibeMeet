import { io } from "socket.io-client";
import { Landing } from "./pages/landing";
import { Chatting } from "./pages/chatting";
import { VideoChat } from "./pages/videoChat";
import { Routes, Route } from "react-router-dom";

function App() {

  return (

    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chat" element={<Chatting />} />
      <Route path="/videoChat" element={<VideoChat />} />
    </Routes>
    
  );
}

export default App;