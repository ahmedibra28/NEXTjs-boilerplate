/**
 * @typedef {import("socket.io").Socket} Socket
 */

/**
 * Socket IO handler
 * @param {Socket} socket - The socket instance
 * @returns {void}
 */
const socketIO = (socket) => {
    // socket.emit('requestHormuudUSSDCode', {
    //     id: '1',
    //     code: '*123#',
    //     // code: '*727*1845822*20*3007#',
    //     model: 'SM-A556E',
    // });

    socket.on('responseHormuudUSSDCode', (data) => {
        console.log('🚀 ', data);
    });




};

module.exports = socketIO;