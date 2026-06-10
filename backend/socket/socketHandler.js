const { handleFindStranger, handleDisconnect, handleNextStranger } = require("./matchmaking");
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

    });

};