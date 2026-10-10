const { handleFindStranger, handleDisconnect, handleNextStranger , handleLeaveChat } = require("./matchmaking");
const { handleMessage } = require("./messageHandler");
const { handleOffer , handleAnswer , handleIceCandidate } = require("./webrtc");

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        socket.on("find-stranger", (chatType) => {
            handleFindStranger(socket , chatType);
        });

        socket.on("message", (data) => {
            handleMessage(socket, data);
        });

        socket.on("disconnect", () => {
            handleDisconnect(socket);
        });

        socket.on("next-stranger", (data) => {
            handleNextStranger(socket, data);
        });

        socket.on("leave-chat" , (data) => {
            handleLeaveChat(socket, data)
        })

        socket.on("typing" , (data) => {
            const { roomId } = data;
            socket.to(roomId).emit("typing");
        })



        socket.on("offer" , (data) => {
            handleOffer(socket , data);
        })

        socket.on("answer" , (data) => {
            handleAnswer(socket , data);
        });

        socket.on("ice-candidate" , (data) => {
            handleIceCandidate(socket , data);
        });

    });

};