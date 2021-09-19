const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// local files
const helper = require('./helper');
const database = require('./database');




/// socket.io server
var Server = require("http").Server;
var server = Server(app);
var io = require("socket.io")(server, {
    allowEIO3: true // false by default
});



const { v4: uuidv4 } = require('uuid'); // random uuid generator -- link https://www.npmjs.com/package/uuid

const botName = "V-Bot"

//---- settings
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

///------- app
app.get('/', (req, res) => {
    const roomID = uuidv4()
    database.addRoom({ id: roomID })
    res.redirect(`/${roomID}`)
})


app.get("/:roomID", (req, res) => {
    const roomID = req.params.roomID
    const room = database.getRoom(roomID)
    if (!room) return res.status(404).send("Room not found")
    res.render('room', { roomID: req.params.roomID, usersLength: room.users.length });
});


io.on('connection', (socket) => {

    console.log('a user connected');
    // 
    const userId = helper.getRandom()
    socket.userID = userId;
    database.addUser({ id: userId });

    socket.on('join', async (roomID, username) => {
        const user = database.updateUser({ id: userId, username: username });
        socket.join(roomID);

        const room = database.addUserToRoom(roomID, user.id)

        let roomUsers = await io.in(roomID).fetchSockets()

        const message = helper.formatMessage(botName, `${username} has joined the room`, "BOT");

        socket.to(roomID).emit("user-connected", user, message, onlines = roomUsers.length, allUsers = room.users);

        socket.on('message', (message) => {
            message = helper.formatMessage(username, message, "USER")
            io.to(roomID).emit("newMessage", message);
        })

        socket.on('disconnect', () => {
            const roomUpdated = database.removeUserFromRoom(roomID, user.id)
            const message = helper.formatMessage(botName, `${username} has left the room`, "BOT")

            io.to(roomID).emit("user-disconnected", user, message, users = roomUpdated.users);
        })
    });

    // disconnect
    socket.on('disconnect', (a) => {
        console.log(a)
        database.removeUser(userId);
        console.log('user disconnected');
    });

})

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Listening on port ' + port);
})


