const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

sendBtn.onclick = sendMessage;

input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});


function sendMessage() {

  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  showTyping();

  // 🔹 Replace this with your backend call later
  setTimeout(() => {
    removeTyping();
    addBotMessage("I'm here with you 🌿 Tell me more.");
  }, 1500);
}


/* ---------- USER MESSAGE ---------- */

function addUserMessage(text) {

  const row = document.createElement("div");
  row.className = "msg-row user";

  const bubble = document.createElement("div");
  bubble.className = "msg user";
  bubble.textContent = text;

  row.appendChild(bubble);
  chatBox.appendChild(row);

  scrollDown();
}


/* ---------- BOT MESSAGE ---------- */

function addBotMessage(text) {

  const row = document.createElement("div");
  row.className = "msg-row bot";

  const logo = document.createElement("img");
  logo.src = "logo.jpeg";   // 🔥 your custom logo
  logo.className = "bot-logo";

  const bubble = document.createElement("div");
  bubble.className = "msg bot";
  bubble.textContent = text;

  row.appendChild(logo);
  row.appendChild(bubble);

  chatBox.appendChild(row);

  scrollDown();
}


/* ---------- TYPING ---------- */

let typingRow;

function showTyping() {

  typingRow = document.createElement("div");
  typingRow.className = "msg-row bot";

  const logo = document.createElement("img");
  logo.src = "lumi-logo.png";
  logo.className = "bot-logo";

  const bubble = document.createElement("div");
  bubble.className = "msg bot typing";
  bubble.textContent = "Typing...";

  typingRow.appendChild(logo);
  typingRow.appendChild(bubble);

  chatBox.appendChild(typingRow);
  scrollDown();
}

function removeTyping() {
  if (typingRow) typingRow.remove();
}


/* ---------- SCROLL ---------- */

function scrollDown() {
  chatBox.scrollTop = chatBox.scrollHeight;
}