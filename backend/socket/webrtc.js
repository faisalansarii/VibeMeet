function handleOffer(socket , data) {

    const { roomId , offer } = data;

    socket.to(roomId).emit("offer" , {
        offer
    });
}


function handleAnswer(socket , data) {

    const { roomId , answer } = data;
    
    socket.to(roomId).emit("answer" , {
        answer
    });
}


function handleIceCandidate(socket , data) {

    const { roomId , candidate } = data;

    socket.to(roomId).emit("ice-candidate" , {
        candidate
    });
}


module.exports = {
    handleOffer,
    handleAnswer,
    handleIceCandidate
}