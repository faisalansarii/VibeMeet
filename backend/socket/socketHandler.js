const { handleFindStranger, handleDisconnect, handleNextStranger , handleLeaveChat } = require("./matchmaking");
const { handleMessage } = require("./messageHandler");

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);

        socket.on("find-stranger", () => {
            handleFindStranger(socket);
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

    });

};