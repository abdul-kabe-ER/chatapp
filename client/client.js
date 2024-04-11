const socket = io('http://localhost:3000');

const form = document.getElementById('sendcontainer');
const messageInput = document.getElementById('msginp');
const messagecontainer = document.querySelector(".container")

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messagecontainer.appendChild(messageElement);
};

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name); // Emit the name directly, not with a callback

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

form.addEventListener('submit', event => {
    event.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});
// client.js

document.addEventListener('DOMContentLoaded', function() {
    // Select the button element
    const sendButton = document.querySelector('.btn');

    // Add click event listener to the button
    sendButton.addEventListener('click', function() {
        // Get the input value
        const message = document.getElementById('msginp').value;

        // Check if the message is not empty
        if (message.trim() !== '') {
            // Create a new message element
            const newMessage = document.createElement('div');
            newMessage.classList.add('msg', 'right');
            newMessage.textContent = message;

            // Append the new message to the container
            document.querySelector('.container').appendChild(newMessage);

            // Clear the input field
            document.getElementById('msginp').value = '';
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.querySelector('.btn');
    const socket = io(); // Establish WebSocket connection

    sendButton.addEventListener('click', function() {
        const message = document.getElementById('msginp').value.trim();

        if (message !== '') {
            socket.emit('chat message', message); // Emit message to server
            document.getElementById('msginp').value = '';
        }
    });

    // Handle incoming messages from server
    socket.on('chat message', function(message) {
        const newMessage = document.createElement('div');
        newMessage.classList.add('msg', 'left');
        newMessage.textContent = message;

        document.querySelector('.container').appendChild(newMessage);
    });

    // Function to show user's name in the page corner for 2 seconds
    function showUserName(name) {
        const userNameElement = document.createElement('div');
        userNameElement.textContent = name;
        userNameElement.classList.add('username');
        document.body.appendChild(userNameElement);

        setTimeout(function() {
            userNameElement.remove();
        }, 2000);
    }

    // Prompt user to enter their name
    const userName = prompt('Please enter your name:');
    if (userName) {
        showUserName(userName);
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const socket = io();

    const messageForm = document.querySelector('#chat-container');
    const messageInput = document.querySelector('#message-input');
    const messageList = document.querySelector('#messages');

    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (messageInput.value) {
            socket.emit('chat message', messageInput.value);
            messageInput.value = '';
        }
    });

    socket.on('chat message', function(message) {
        const li = document.createElement('li');
        li.textContent = message;
        messageList.appendChild(li);
    });
});
io.on('connection', socket => {
    console.log('A user connected');

    // Example: Handle chat messages
    socket.on('chat message', message => {
        console.log('Received message:', message);
        // Broadcast the message to all clients
        io.emit('chat message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
