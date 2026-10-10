let waitingTextUser = null;
let waitingVideoUser = null;

const socketToRoom = new Map();



function handleFindStranger(socket, chatType) {

    let waitingUser;

    if (chatType === "text") {
        waitingUser = waitingTextUser;
    } else if (chatType === "video") {
        waitingUser = waitingVideoUser;
    } else {
        return;
    }

    if (waitingUser === null) {

        if (chatType === "text") {
            waitingTextUser = socket;
        } else {
            waitingVideoUser = socket;
        }

    } else {

        const roomId = `${chatType}-room-${waitingUser.id}-${socket.id}`;

        waitingUser.join(roomId);
        socket.join(roomId);

        socketToRoom.set(waitingUser.id, roomId);
        socketToRoom.set(socket.id, roomId);

        waitingUser.emit("matched", {
            roomId,
            isCaller: true
        });

        socket.emit("matched", {
            roomId,
            isCaller: false
        });

        if (chatType === "text") {
            waitingTextUser = null;
        } else {
            waitingVideoUser = null;
        }
    }
}



function removeFromWaitingQueues(socket) {
    if (waitingTextUser === socket) {
        waitingTextUser = null;
    }

    if (waitingVideoUser === socket) {
        waitingVideoUser = null;
    }
}

function removeRoomMappings(roomId) {
    for (const [socketId, mappedRoomId] of socketToRoom.entries()) {
        if (mappedRoomId === roomId) {
            socketToRoom.delete(socketId);
        }
    }
}


function handleDisconnect(socket) {

    removeFromWaitingQueues(socket);

    const roomId = socketToRoom.get(socket.id);

    if (roomId) {
        socket.to(roomId).emit("stranger-disconnected");
        removeRoomMappings(roomId);
    }
}


function handleNextStranger(socket, data) {

    removeFromWaitingQueues(socket);

    const { roomId } = data || {};

    if (!roomId) {
        return;
    }

    socket.to(roomId).emit("stranger-disconnected");

    removeRoomMappings(roomId);

    socket.leave(roomId);
}


function handleLeaveChat(socket, data) {

    removeFromWaitingQueues(socket);

    const { roomId } = data || {};

    if (!roomId) {
        return;
    }

    socket.to(roomId).emit("stranger-disconnected");

    removeRoomMappings(roomId);

    socket.leave(roomId);
}
 

module.exports = {
    handleFindStranger,
    handleDisconnect,
    handleNextStranger,
    handleLeaveChat
};