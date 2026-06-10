function handleMessage(socket, data) {

    const { roomId , text } = data;

    socket.to(roomId).emit("message", { text });

}

module.exports = {
    handleMessage
};