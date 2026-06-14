import {
  ArrowLeft,
  Moon,
  Shuffle,
  Send
} from "lucide-react";

import { useState , useEffect , useRef } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";


export const Chatting = () => {

  const navigateHome = useNavigate();


  const [roomId, setRoomId] = useState(null);
  const [status, setStatus] = useState("searching");


  const [messages, setMessages] = useState([]);
  
  const [isTyping , setIsTyping] = useState(false);
  
  const [input, setInput] = useState("");


  const sendMessage = () => {

    if (status !== "connected") return;
    if (!input.trim()) return;

    socket.emit("message", {
      roomId : roomId,
      text : input
    });

    setMessages(prev => [
      ...prev,
      {
        text: input,
        sender: "me"
      }
    ]);

    setInput("");
  };


  useEffect(() => {

    socket.emit("find-stranger")

    socket.on("matched" , ({roomId}) => {
      setRoomId(roomId);
      setStatus("connected");
    })


    socket.on("message", (data) => {

      const { text } = data;

      setMessages(prev => [
        ...prev,
        {
          text: text,
          sender: "stranger"
        }
      ]);

    });


    socket.on("stranger-disconnected", () => {
      setStatus("disconnected");
      setMessages([]);
      setRoomId(null);
    });

    
    socket.on("typing" , () => {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    });


    return () => {
      socket.off("matched");
      socket.off("message");
      socket.off("stranger-disconnected");
      socket.off("typing");
    };

  }, []);


  const handleNextStranger = () => {

    socket.emit("next-stranger", { roomId });

    setMessages([]);
    setStatus("searching");
    setRoomId(null);

    socket.emit("find-stranger");
  }


  const handleBackHome = () => {
    navigateHome("/");
    socket.emit("leave-chat", { roomId });
  };


  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);


  return (
    <div className="h-screen bg-white flex flex-col">

      {/* Navbar */}
      <header className="h-20 border-b border-black flex items-center justify-between px-4">

        <button
          onClick={handleBackHome}
          className="
            flex items-center gap-2
            font-semibold
            cursor-pointer
            hover:opacity-70
            transition">

          <ArrowLeft size={22} />
          <span className="hidden sm:block">
            Back Home
          </span>
        </button>


        <div className="flex items-center gap-4">

          <button
            className="
              w-11 h-11
              border border-black
              rounded-full
              flex items-center justify-center
              cursor-pointer
              hover:bg-black
              hover:text-white
              transition">

            <Moon size={18} />
          </button>

          <button
            onClick={handleNextStranger}
            className="
              px-5 py-3
              bg-black
              text-white
              rounded-full
              flex items-center gap-2
              cursor-pointer
              hover:scale-105
              transition duration-300">

            <Shuffle size={18} />
            <span className="hidden sm:block">
              Next Stranger
            </span>
          </button>

        </div>

      </header>

      {/* Asli Chatting */}
      <main
        className="
          flex-1
          overflow-y-auto
          px-5
          mt-8
          mb-5">

        <div className="min-h-full flex flex-col justify-end">

          {/* Messages */}

          <div className="space-y-3">


          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">

              <div className="text-center">

                <h2 className="text-2xl font-bold">
                  {status === "searching" ? "Looking for a stranger..." : status === "connected" ? "Connected to a stranger!" : "Stranger disconnected!"}
                </h2>

                <p className="text-gray-500 mt-2">
                  {status === "searching" ? "Please wait while we find someone." : status === "connected" ? "You can now talk to the stranger!" : "Please click the 'Next Stranger' button to find someone new."}
                </p>

              </div>

            </div>

          ) : (

            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "me"
                    ? "justify-end"
                    : "justify-start"
                }`}>

                <div
                  className={`
                    px-5
                    py-3
                    rounded-4xl
                    max-w-[80%]
                    md:max-w-[65%]
                    lg:max-w-[50%]
                    text-base
                    md:text-lg
                    break-words whitespace-pre-wrap
                    ${
                      msg.sender === "me"
                        ? "bg-black text-white"
                        : "border border-black"
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

            <div ref={bottomRef}></div>

          </div>

          {isTyping && (
            <p className="text-sm text-gray-500">
              Stranger is typing...
            </p>
          )}

        </div>



      </main>

      {/* Input */}

      <footer className="border-t border-black p-4 md:p-6">

        <div className="flex items-center gap-3">

          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => {
                        setInput(e.target.value)
                        socket.emit("typing" , { roomId })
                      }}
            disabled={status !== "connected"}
            onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          sendMessage();
                        }
                      }}
            className="
              flex-1
              border
              border-black
              rounded-full
              px-6
              py-4
              text-base
              md:text-lg
              outline-none
              disabled:cursor-not-allowed"/>


          <button
            onClick={sendMessage}
            disabled={status !== "connected"}
            className="
              bg-black
              text-white
              w-14
              h-14
              md:w-16
              md:h-16
              rounded-full
              flex
              items-center
              justify-center
              cursor-pointer
              hover:scale-105
              transition
              disabled:cursor-not-allowed">
                
            <Send size={22} />
          </button>

        </div>

      </footer>

    </div>
  );
}