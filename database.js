const users = new Map();
const messages = new Map();
const rooms = new Map();

// Function: addUser
// Adds a user to the database

class dataBase {
    addUser(user) {
        users.set(user.id, user);
        return user;
    }

    getUser(id) {
        return users.get(id)
    }

    removeUser(id) {
        users.delete(id);

    }

    updateUser(user) {
        let userOnData = users.get(user.id)
        userOnData = { ...userOnData, ...user }
        users.set(user.id, userOnData);
        return userOnData;
    }

    // Function: addMessage
    // Adds a message to the database

    addMessage(roomID, message) {
        let items = [{ ...message }]
        const messagesRoom = getMessages(roomID);
        if (messagesRoom)
            items.push(...messagesRoom);
        messages.set(roomID, items);
        return message;
    }

    getMessages(roomID) {
        return messages.get(roomID);
    }


    // Function: removeMessage
    // Removes a message from the database

    removeMessage(roomID, message) {
        const messagesRoom = getMessages(roomID);
        if (!messagesRoom) return false;
        const index = messagesRoom.findIndex(m => m.id === message.id);
        if (index === -1) return false;
        messagesRoom.splice(index, 1);
        messages.set(roomID, messagesRoom);
        return true;
    }


    // Function: addRoom
    // Adds a room to the database
    addRoom(room) {
        room.users = []
        rooms.set(room.id, room);
    }

    getRoom(id) {
        return rooms.get(id)
    }

    addUserToRoom(id, userID) {
        const room = this.getRoom(id)
        room.users.push(userID);
        return this.updateRoom(room);
    }

    removeUserFromRoom(id, userID) {
        const room = this.getRoom(id)
        const index = room.users.findIndex(uId => uId === userID);
        if (index === -1) return false;
        room.users.splice(index, 1);
        return this.updateRoom(room);

    }

    updateRoom(room) {
        rooms.set(room.id, room);
        return room
    }
}
module.exports = new dataBase();