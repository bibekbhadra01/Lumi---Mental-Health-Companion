const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

const features = document.querySelectorAll(".feature");

const musicPlayer = document.getElementById("musicPlayer");
const spotifyFrame = document.getElementById("spotifyFrame");

const playlistURL = "https://open.spotify.com/embed/playlist/3QQkQsYBTKZaKKsVINZdHA?utm_source=generator";

let breathingTimers = [];
let welcomeShown = false;

/* -------------------------
   MODE STATE MANAGEMENT
--------------------------*/
let currentMode = "general";

let chats = {
  general: [],
  rant: [],
  selfcare: [],
  breathing: [],
  music: []
};

function switchMode(newMode) {

  // Stop breathing timers when leaving breathing mode
  breathingTimers.forEach(timer => clearTimeout(timer));
  breathingTimers = [];

  chatBox.innerHTML = "";

  currentMode = newMode;

  chats[currentMode].forEach(message => {
    renderMessage(message);
  });

  if (newMode === "general" && !welcomeShown) {
  addBotMessage("Hey, I’m Lumi, and I'm so glad to see you here! What's on your mind right now?");
  welcomeShown = true;
}

  scrollDown();
}

features.forEach(feature => {
  feature.addEventListener("click", () => {

    features.forEach(f => f.classList.remove("active"));
    feature.classList.add("active");

    const featureText = feature.innerText.toLowerCase();

    if (featureText.includes("rant")) {
      hideMusic();
      switchMode("rant");
      addBotMessage("You are now in Rant Mode. Let it all out.");
    }
    else if (featureText.includes("self-care")) {
      hideMusic();
      switchMode("selfcare");
      addBotMessage("You are now in Self-Care Mode. Be kind to yourself.");
      
    }
    else if (featureText.includes("breathing")) {
      switchMode("breathing");
      hideMusic();
      addBotMessage("You are now in Breathing Mode. Follow the exercise with me.");
      startBreathingExercise();
    }
    else if (featureText.includes("music")) {
      switchMode("music");
      showMusic();
    }
    else {
      switchMode("general");
      hideMusic();
    }

  });
});

/* -------------------------
   SEND MESSAGE
--------------------------*/

async function sendMessage() {

  const text = input.value.trim();
  if (!text) return;

  const modeAtSend = currentMode;

  addUserMessage(text);
  input.value = "";

  // If breathing mode → do NOT call backend
  if (modeAtSend === "breathing") {
    startBreathingExercise();
    return;
  }

  showTyping();

  try {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        mode: modeAtSend
      })
    });

    const data = await response.json();

    removeTyping();

    // If user is still in same mode
    if (modeAtSend === currentMode) {
      addBotMessage(data.response);
    } else {
      chats[modeAtSend].push({
        sender: "bot",
        text: data.response
      });
    }

  } catch (error) {
    removeTyping();
    addBotMessage("⚠️ Backend not reachable.");
    console.error(error);
  }
}
/* -------------------------
   BREATHING MODE (FRONTEND ONLY)
--------------------------*/

function startBreathingExercise() {

  // Clear any existing timers
  breathingTimers.forEach(timer => clearTimeout(timer));
  breathingTimers = [];

  const steps = [
    "🌬️ Inhale slowly for 4 seconds...",
    "Hold for 4 seconds...",
    "Exhale gently for 6 seconds...",
    "Let's repeat that once more..."
  ];

  let index = 0;

  function nextStep() {

    if (currentMode !== "breathing") return; // STOP if mode changed

    if (index < steps.length) {
      addBotMessage(steps[index]);
      index++;

      const timer = setTimeout(nextStep, 4000);
      breathingTimers.push(timer);
    }
  }

  nextStep();
}

/* -------------------------
   MUSIC
--------------------------*/

function showMusic() {
  spotifyFrame.src = playlistURL;
  musicPlayer.style.display = "block";
}

function hideMusic() {
  spotifyFrame.src = "";
  musicPlayer.style.display = "none";
}

/* -------------------------
   UI MESSAGE FUNCTIONS
--------------------------*/

function addUserMessage(text) {

  const message = {
    sender: "user",
    text: text
  };

  chats[currentMode].push(message);
  renderMessage(message);
}

function addBotMessage(text) {

  const message = {
    sender: "bot",
    text: text
  };

  chats[currentMode].push(message);
  renderMessage(message);
}

function formatMessage(text) {

  // Escape HTML to prevent injection
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Convert markdown-style bullet points into HTML list
  const lines = text.split("\n");
  let formatted = "";
  let inList = false;

  lines.forEach(line => {
    const trimmed = line.trim();

    // Detect bullet points starting with "-" or "*"
    if (/^[-*]\s+/.test(trimmed)) {
      if (!inList) {
        formatted += "<ul>";
        inList = true;
      }
      formatted += "<li>" + trimmed.replace(/^[-*]\s+/, "") + "</li>";
    } else {
      if (inList) {
        formatted += "</ul>";
        inList = false;
      }

      if (trimmed === "") {
        formatted += "<br>";
      } else {
        formatted += "<p>" + trimmed + "</p>";
      }
    }
  });

  if (inList) {
    formatted += "</ul>";
  }

  return formatted;
}

function renderMessage(message) {

  const row = document.createElement("div");
  row.className = "msg-row " + message.sender;

  const bubble = document.createElement("div");
  bubble.className = "msg " + message.sender;
  bubble.innerHTML = formatMessage(message.text);

  if (message.sender === "bot") {
    const logo = document.createElement("img");
    logo.src = "lumi-logo.jpeg";
    logo.className = "bot-logo";
    row.appendChild(logo);
  }

  row.appendChild(bubble);
  chatBox.appendChild(row);

  scrollDown();
}

/* -------------------------
   TYPING
--------------------------*/

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

/* -------------------------
   SCROLL
--------------------------*/

function scrollDown() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* -------------------------
   EVENT LISTENERS
--------------------------*/

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});