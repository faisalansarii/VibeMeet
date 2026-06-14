let waitingUser = null;

const socketToRoom = new Map();


function handleFindStranger(socket) {

    if (waitingUser === null) {

        waitingUser = socket;

    } 
    else {

        const roomId = `room-${waitingUser.id}-${socket.id}`;

        waitingUser.join(roomId);
        socket.join(roomId);

        socketToRoom.set(waitingUser.id, roomId);
        socketToRoom.set(socket.id, roomId);
        console.log(socketToRoom);

        waitingUser.emit("matched", { roomId });
        socket.emit("matched", { roomId });

        waitingUser = null;
    }
}

function handleDisconnect(socket) {

    if (waitingUser === socket) {
        waitingUser = null;
    }

    const roomId = socketToRoom.get(socket.id);

    if (roomId) {
        socket.to(roomId).emit("stranger-disconnected");
        socketToRoom.delete(socket.id);
    }
}


function handleNextStranger(socket, data) {

    const { roomId } = data;

    socket.to(roomId).emit("stranger-disconnected");

    socketToRoom.delete(socket.id);

    socket.leave(roomId);
}


function handleLeaveChat(socket , data) {

    const { roomId } = data;

    socket.to(roomId).emit("stranger-disconnected");
    
    socketToRoom.delete(socket.id);

    socket.leave(roomId);
}
 

module.exports = {
    handleFindStranger,
    handleDisconnect,
    handleNextStranger,
    handleLeaveChat
};