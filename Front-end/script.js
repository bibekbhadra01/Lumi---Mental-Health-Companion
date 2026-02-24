const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

const musicBtn = document.getElementById("musicBtn");
const musicPlayer = document.getElementById("musicPlayer");
const spotifyFrame = document.getElementById("spotifyFrame");

const features = document.querySelectorAll(".feature");

const playlistURL = "https://open.spotify.com/embed/playlist/3QQkQsYBTKZaKKsVINZdHA?utm_source=generator";

features.forEach(feature => {
  feature.addEventListener("click", () => {

    // Remove active class from all
    features.forEach(f => f.classList.remove("active"));
    feature.classList.add("active");

    // If music clicked → show player
    if (feature.id === "musicBtn") {
      spotifyFrame.src = playlistURL;
      musicPlayer.style.display = "block";
    } 
    
    // Any other feature → hide player
    else {
      spotifyFrame.src = ""; // stops music
      musicPlayer.style.display = "none";
    }

  });
});

async function sendMessage() {

  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  showTyping();

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    removeTyping();
    addBotMessage(data.response);

  } catch (error) {
    removeTyping();
    addBotMessage("⚠️ Backend not reachable.");
    console.error(error);
  }
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
  logo.src = "lumi-logo.jpeg";
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

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});