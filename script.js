let characters = {};
let currentCharacter = null;
let dialogueIndex = 0;
let playerReputation = {};
let playerTags = {};

const characterList = document.getElementById("characterList");
const chatBox = document.getElementById("chatBox");
const choiceBox = document.getElementById("choiceBox");
const headerName = document.getElementById("headerName");
const headerIcon = document.getElementById("headerIcon");

fetch("stories.json")
  .then(res => res.json())
  .then(data => {
    characters = data;
    init();
  });

// Initialize character list
function init() {
    characterList.innerHTML = "";
    Object.keys(characters).forEach((key, idx) => {
        const charDiv = document.createElement("div");
        charDiv.className = "character";
        charDiv.innerHTML = `
            <div class="character-icon" style="background:${characters[key].iconColor}"></div>
            ${characters[key].name}
        `;
        charDiv.onclick = () => openChat(key);
        characterList.appendChild(charDiv);
    });
}

// Open a character's chat
function openChat(key) {
    currentCharacter = characters[key];
    dialogueIndex = 0;

    headerName.textContent = currentCharacter.name;
    headerIcon.style.background = currentCharacter.iconColor;

    // Highlight active character
    document.querySelectorAll(".character").forEach(el => el.classList.remove("active"));
    document.querySelector(`#characterList .character:nth-child(${Object.keys(characters).indexOf(key)+1})`).classList.add("active");

    loadDialogue();
}

// Load the current scene
function loadDialogue() {
    chatBox.innerHTML = "";
    choiceBox.innerHTML = "";

    if (!currentCharacter.scenes[dialogueIndex]) return;
    const scene = currentCharacter.scenes[dialogueIndex];

    addMessage(scene.npc, "npc");

    scene.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.text;
        btn.onclick = () => {
            addMessage(choice.text, "player");
            addMessage(choice.reply, "npc");

            applyChoiceEffects(choice);

            if (choice.next !== undefined) {
                dialogueIndex = choice.next;
                setTimeout(loadDialogue, 400);
            }
        };
        choiceBox.appendChild(btn);
    });
}

// Add message to chat box with typewriter effect
function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.textContent = "";
    chatBox.appendChild(msg);

    let i = 0;
    const interval = setInterval(() => {
        msg.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 15);
}

// Apply choice effects (reputation & tags)
function applyChoiceEffects(choice) {
    if (choice.reputation) {
        Object.keys(choice.reputation).forEach(char => {
            playerReputation[char] = (playerReputation[char] || 0) + choice.reputation[char];
        });
    }

    if (choice.tags) {
        choice.tags.forEach(tag => {
            playerTags[tag] = (playerTags[tag] || 0) + 1;
        });
    }
}

// Profile overlay logic
const profileOverlay = document.getElementById("profileOverlay");
const profileName = document.getElementById("profileName");
const profileDescription = document.getElementById("profileDescription");
const profileIcon = document.getElementById("profileIcon");

document.getElementById("chatHeader").onclick = () => {
    if (!currentCharacter) return;

    profileName.textContent = currentCharacter.name;
    profileDescription.textContent = currentCharacter.description;
    profileIcon.style.background = currentCharacter.iconColor;

    profileOverlay.classList.remove("hidden");
    setTimeout(() => profileOverlay.classList.add("show"), 10);
};

function closeProfile() {
    profileOverlay.classList.remove("show");
    setTimeout(() => profileOverlay.classList.add("hidden"), 300);
}
