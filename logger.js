class Logger {
    /**
     * @param {string} room The room's ID
     * @param {string} admin The username of the room's admin
     */
    static createRoomSuccess(room, admin) {
        this.info(`room ${room.brightMagenta} created by ${admin.brightYellow}`);
    }

    /**
     * @param {string} admin The username of the admin the tried to create the room
     */
    static createRoomFail(admin) {
        this.warning(`room creation by ${admin.brightYellow} failed`);
    }

    /**
     * @param {string} room The room's ID
     * @param {string} username The username of the joining user
     */
    static joinRoomSuccess(room, username) {
        this.info(`user ${username.brightYellow} join room ${room.brightMagenta}`);
    }

    /**
     * @param {string} room The room's ID
     * @param {string} username The username of the joining user
     */
    static joinRoomFail(room, username) {
        this.warning(`user ${username.brightYellow} failed to join room ${room.brightMagenta}`);
    }

    /**
     * @param {string} room The room's ID
     * @param {string} username The username of the disconnecting user 
     */
    static notifyDisconnecting(room, username) {
        this.info(`user ${username.cyan} disconnected from room ${room.brightMagenta}`);
    }

    /**
     * @param {string} message
     */
    static info(message) {
        let timestamp = new Date().toISOString().slice(0, 19).split('T').join(' ');
        console.log(`${timestamp} ${'INF'.brightCyan} ${message}`);
    }

    /**
     * @param {string} message
     */
    static warning(message) {
        let timestamp = new Date().toISOString().slice(0, 19).split('T').join(' ');
        console.log(`${timestamp} ${'WRN'.brightYellow} ${message}`);
    }

    /**
     * @param {string} message
     */
    static error(message) {
        let timestamp = new Date().toISOString().slice(0, 19).split('T').join(' ');
        console.log(`${timestamp} ${'ERR'.brightRed} ${message}`);
    }
}

module.exports = Logger;