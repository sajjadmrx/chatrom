const socket = io();

let notificationsound = true


const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");

showChat.addEventListener("click", () => {
    document.querySelector(".main__right").style.display = "flex";
    document.querySelector(".main__right").style.flex = "1";
    document.querySelector(".main__left").style.display = "none";
    document.querySelector(".header__back").style.display = "block";
});
backBtn.addEventListener("click", () => {
    document.querySelector(".main__left").style.display = "flex";
    document.querySelector(".main__left").style.flex = "1";
    document.querySelector(".main__right").style.display = "none";
    document.querySelector(".header__back").style.display = "none";
});


const messageInput = document.getElementById("chat_message");


// user name 
let username;

while (!username) {
    username = prompt("Enter your name: ");
}

socket.emit('join', roomID, username);



socket.on("user-connected", (username, message, roomUsersLen, allUsers) => {
    console.log(username, message, roomUsersLen);
    addMessageToMessages(message);
    updateUsersLength(allUsers.length);
})

socket.on("user-disconnected", (user, message, users = roomUpdated.users) => {
    updateUsersLength(users.length);
    addMessageToMessages(message);
})

messageInput.addEventListener("keydown", (e) => {
    if (!messageInput.value || messageInput.value == '') return;
    if (e.key != "Enter") return;
    socket.emit("message", messageInput.value)
    messageInput.value = '';
})


socket.on("newMessage", addMessageToMessages)

function addMessageToMessages(message) {
    const sender = message.sender;
    const messagesDiv = document.getElementById("messages")
    const messageDiv = document.createElement("div");

    messageDiv.id = message.id;
    messageDiv.className = "message";

    messageDiv.innerHTML = `<b><i class="far fa-user-circle"></i> <span > ${username === sender ? "me" : sender
        }</span> </b>
        <span id="${message.type}">${message.text}</span>`

    messagesDiv.appendChild(messageDiv);

    // scroll to bottom
    messageDiv.scrollIntoView();


    // play sound
    if (sender == username) return;
    playSound();

}
function updateUsersLength(roomUsersLen) {
    document.getElementById("users_length").innerHTML = `users: ${roomUsersLen}`;
}

function playSound() {
    const audio = new Audio('./sounds/newMessage.ogg');
    audio.play();
}