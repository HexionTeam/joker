class Logger {
    /**
     * @param {string} room The room's ID
     * @param {string} admin The username of the room's admin
     */
    static createRoomSuccess(room, admin) {
        console.log(`CREATE room ${room.brightMagenta} by ${admin.brightYellow}`);
    }

    /**
     * @param {string} admin The username of the admin the tried to create the room
     */
    static createRoomFail(admin) {
        console.log(`FAILED room creation by ${admin.brightYellow}`);
    }

    /**
     * @param {string} room The room's ID
     * @param {string} username The username of the disconnecting user 
     */
    static notifyDisconnecting(room, username) {
        console.log(`NOTIFY room ${room.brightMagenta} that ${username.cyan} disconnected`);
    }
}

module.exports = Logger;