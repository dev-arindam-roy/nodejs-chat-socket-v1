
const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const typingEl = document.getElementById('typing');
const roomInput = document.getElementById('room-input');
const joinBtn = document.getElementById('join-room');

let joinedRoom = false;

joinBtn.addEventListener('click', () => {
    const room = roomInput.value.trim();
    if (room) {
        socket.emit('join room', room);
        roomInput.disabled = true;
        joinBtn.disabled = true;
        joinedRoom = true;
    }
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value && joinedRoom) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function (data) {
    const msg = data.msg || 'No message';
    const time = data.time || new Date().toLocaleTimeString();
    const item = document.createElement('li');
    item.innerHTML = `<strong>[${time}]</strong> ${msg}`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

// Typing indicator
input.addEventListener('input', () => {
    if (joinedRoom) {
        socket.emit('typing', true);
        clearTimeout(input._typingTimeout);
        input._typingTimeout = setTimeout(() => {
            socket.emit('typing', false);
        }, 1000);
    }
});

socket.on('display typing', (isTyping) => {
    typingEl.style.display = isTyping ? 'block' : 'none';
});
