import { useState , useEffect , useRef } from "react"
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

import { ArrowLeft , Moon , Shuffle } from "lucide-react";


export const VideoChat = () => {

    const navigateHome = useNavigate();

    const roomId = useRef(null);
    const [status, setStatus] = useState("searching");


    const localStream = useRef(null);
    const localVideoRef = useRef(null);
    const remoteStream = useRef(null);
    const remoteVideoRef = useRef(null);

    const peerConnection = useRef(null);
    const isCaller = useRef(false);


    
    const createPeerConnection = () => {

        const pc = new RTCPeerConnection();

        peerConnection.current = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", {
                    roomId: roomId.current,
                    candidate: event.candidate
                });
            }
        };

        pc.ontrack = (event) => {
            remoteStream.current = event.streams[0];
            remoteVideoRef.current.srcObject = remoteStream.current;

            setStatus("connected");
        };

        pc.onconnectionstatechange = () => {
            console.log("Connection State:", pc.connectionState);
        };

        if (localStream.current) {
            localStream.current.getTracks().forEach(track => {
                pc.addTrack(track, localStream.current);
            });
        }
    };


    useEffect(() => {

        async function startMedia() {

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            localStream.current = stream;
            localVideoRef.current.srcObject = stream;

            createPeerConnection();
            
            socket.emit("find-stranger");
        }
    
        startMedia(); 


        
        return () => {
            localStream.current?.getTracks().forEach(track => track.stop());
            peerConnection.current?.close();
        };
    
    } , []);


    useEffect(() => {   

        socket.on("matched" , async ({ roomId : receivedRoomId , isCaller : caller }) => {

            console.log("Matched! Peer:", peerConnection.current);

            roomId.current = receivedRoomId;
            isCaller.current = caller;


            if(caller) {
    
                const offer = await peerConnection.current.createOffer();
                console.log("Caller Peer:", peerConnection.current);
                await peerConnection.current.setLocalDescription(offer);


                socket.emit("offer" , {
                    roomId : roomId.current,
                    offer : offer
                });

            }             
        });
        
        socket.on("offer" , async ({ offer }) => {

            console.log("Receiver Peer:", peerConnection.current);
            await peerConnection.current.setRemoteDescription(offer);
            console.log("REMOTE DESCRIPTION SET");

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);


            socket.emit("answer" , ({ 
                roomId : roomId.current,
                answer
            }));
            
        });


        socket.on("answer" , async ({ answer }) => {
            console.log("ANSWER RECEIVED");
            await peerConnection.current.setRemoteDescription(answer);
        });


        socket.on("ice-candidate" , async ({ candidate }) => {
            await peerConnection.current.addIceCandidate(candidate);
        });


        
        socket.on("stranger-disconnected" , () => {

            setStatus("disconnected");

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }

            remoteStream.current = null;
        });


        return () => {
            socket.off("matched");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
            socket.off("stranger-disconnected");
        };

    } , []);


    const handleNextStranger = () => {

        socket.emit("leave-chat", {
            roomId: roomId.current
        });

        peerConnection.current?.close();

        peerConnection.current = null;

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        remoteStream.current = null;

        roomId.current = null;
        isCaller.current = false;

        setStatus("searching");

        createPeerConnection();

        socket.emit("find-stranger");
    };


    const handleBackHome = () => {

        socket.emit("leave-chat", { roomId : roomId.current });
        
        localStream.current.getTracks().forEach(track => {
            track.stop();
        });
        
        peerConnection.current.close();
        
        setStatus("disconnected");
        navigateHome("/");
    };

    
    return (
        <div>

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



            <div className="flex flex-col md:flex-row px-5 gap-4 mt-8">

                <video
                    className="w-full md:w-[50%] aspect-video object-cover rounded-lg"
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    />


                {status === "searching" && (
                    <div className="w-[50%] bg-[#bdbbbb] flex items-center justify-center flex-col gap-4 rounded-lg">

                        <div className="flex items-center justify-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#9e9d9d] border-t-transparent"></div>
                        </div>

                        <p className="text-lg font-semibold">
                            Searching for a stranger...
                        </p>
                    </div>
                )}

                {status === "disconnected" && (
                    <div className="w-[50%] bg-[#bdbbbb] flex items-center justify-center flex-col gap-4 rounded-lg">
                        <p className="text-lg font-semibold">
                            Stranger disconnected.
                        </p>
                    </div>
                )}

                <video
                    className={`w-full md:w-[50%] aspect-video object-cover rounded-lg ${status === "connected" ? "block" : "hidden"}`}
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                />

            </div>
        </div>
    )

    
}