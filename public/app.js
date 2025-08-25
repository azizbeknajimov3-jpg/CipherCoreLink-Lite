const socket = io();

const chat = document.getElementById('chat');
const input = document.getElementById('command');
document.getElementById('send').onclick = send;
document.getElementById('statusBtn').onclick = () => socket.emit('command', 'status');

socket.on('progress', (p) => addLine('… ' + JSON.stringify(p), 'progress'));
socket.on('commandResponse', (res) => addLine('AI: ' + JSON.stringify(res), 'bot'));

function send() {
  const v = input.value.trim();
  if (!v) return;
  addLine('Siz: ' + v, 'user');
  socket.emit('command', v);
  input.value = '';
}

function addLine(text, cls='bot') {
  const p = document.createElement('p');
  p.className = cls;
  p.textContent = text;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}