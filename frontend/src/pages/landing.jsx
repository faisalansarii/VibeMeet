import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Landing = () => {

  const [mode , setMode] = useState("");

  const navigateChat = useNavigate();
  const navigateVideoChat = useNavigate();

  const navigateTo = () => {

    if(mode === "text") {
      navigateChat("/chat");
    }
    else if (mode === "video") {
      navigateVideoChat("/videoChat");
    }
    else if (mode === "both") {
      return alert("Both mode is coming soon! Stay tuned.");
    }
    else {
      return alert("Please select a mode to continue.");
    }

  }


  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-6">

      <div className="relative w-full max-w-6xl">

        <img
          src="https://i.pravatar.cc/100?img=1"
          className="absolute
                    left-2 md:left-10
                    top-10 md:top-20
                    w-10 h-10 md:w-20 md:h-20
                    rounded-full
                    border-2 border-black"/>

        <img
          src="https://i.pravatar.cc/100?img=5"
          className="absolute 
                    right-2 md:right-10 
                    top-6 md:top-10 
                    w-12 h-12 md:w-20 md:h-20 
                    rounded-full 
                    border-2 border-black"/>

        <img
          src="https://i.pravatar.cc/100?img=12"
          className="hidden md:block absolute left-0 top-64 w-20 h-20 rounded-full border-2 border-black"/>

        <img
          src="https://i.pravatar.cc/100?img=4"
          className="hidden md:block absolute right-0 top-64 w-20 h-20 rounded-full border-2 border-black"/>


        <div className="flex flex-col items-center pt-16">

          <h1
            className="
              text-6xl
              md:text-7xl
              font-black
              uppercase
              text-transparent
              [-webkit-text-stroke:3px_black]
              text-center">
            Talk To
            <br />
            Strangers
          </h1>

          <p className="mt-5 text-xl text-center max-w-xl">
            Get paired randomly with someone online and start a
            conversation instantly.
          </p>


          {/* Mode */}
          <div className="grid md:grid-cols-3 gap-4 mt-12 w-full max-w-3xl">

            <button
              onClick={() => setMode("text")}
              className={`border-2 rounded-3xl p-5 text-left transition-all duration-400 cursor-pointer
              ${
                mode === "text"
                  ? "bg-black text-white border-black"
                  : "border-black hover:-translate-y-1"
              }`}>

              <h3 className="font-bold text-xl">💬 Text Chat</h3>
              <p className="mt-2 text-sm opacity-80">
                Anonymous messaging
              </p>
            </button>

            <button
              onClick={() => setMode("video")}
              className={`border-2 rounded-3xl p-5 text-left transition-all duration-400 cursor-pointer
              ${
                mode === "video"
                  ? "bg-black text-white border-black"
                  : "border-black hover:-translate-y-1"
              }`}>

              <h3 className="font-bold text-xl">📹 Video Chat</h3>
              <p className="mt-2 text-sm opacity-80">
                Face-to-face conversation
              </p>
            </button>

            <button
              onClick={() => setMode("both")}
              className={`border-2 rounded-3xl p-5 text-left transition-all duration-400 cursor-pointer
              ${
                mode === "both"
                  ? "bg-black text-white border-black"
                  : "border-black hover:-translate-y-1"
              }`}>

              <h3 className="font-bold text-xl">⚡ Both</h3>
              <p className="mt-2 text-sm opacity-80">
                Text + video together
              </p>
            </button>

          </div>


          <button
          onClick={navigateTo}
            className="
              mt-10
              bg-black
              text-white
              px-10
              py-5
              rounded-full
              text-lg
              font-bold
              hover:scale-105
              transition duration-300
              cursor-pointer">
            Start Chatting →
          </button>


          <div
            className="
              mt-12
              w-full
              max-w-6xl
              border
              border-black
              rounded-[2rem]
              p-8
              flex
              flex-col
              md:flex-row
              justify-between
              items-center
              gap-6">


            <div className="flex items-center gap-6">

              <div
                className="
                    w-20
                    h-20
                    rounded-full
                    border-2
                    border-black
                    flex
                    items-center
                    justify-center
                    text-4xl">
                  <MessageCircle size={36}/>
                </div>

                <div>
                    <h2 className="text-3xl font-bold">
                        Be Yourself. Meet Someone New.
                    </h2>

                    <p className="mt-2 text-gray-1000">
                        Every conversation is a new adventure.
                    </p>
                </div>

            </div>

                <button
                    className="
                    border-2
                    border-black
                    px-8
                    py-4
                    rounded-full
                    font-semibold
                    hover:bg-black
                    hover:text-white
                    transition duration-300 cursor-pointer">
                    How It Works ?
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}