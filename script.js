const characters = {
    aldric: {
        name: "Sir Aldric",
        description: "A hardened knight bound by oath and debt.",
        iconColor: "#6b3f1d",
        dialogue: [
            {
                npc: "You return. Have you come to settle your debt?",
                choices: [
                    { text: "I have the coin.", reply: "Then we are square." },
                    { text: "Not yet.", reply: "Do not test my patience." }
                ]
            }
        ]
    },
    mirelle: {
        name: "Lady Mirelle",
        description: "A noblewoman whose smile hides calculation.",
        iconColor: "#7a1d3f",
        dialogue: [
            {
                npc: "You look lost in my halls.",
                choices: [
                    { text: "I seek alliance.", reply: "Alliance requires trust." },
                    { text: "Just passing through.", reply: "Few pass without purpose." }
                ]
            }
        ]
    }
};

let currentCharacter = null;

const characterList = document.getElementById("characterList");
const chatBox = document.getElementById("chatBox");
const choiceBox = document.getElementById("choiceBox");
const headerName = document.getElementById("headerName");
const headerIcon = document.getElementById("headerIcon");

function init() {
    for (let key in characters) {
        const charDiv = document.createElement("div");
        charDiv.className = "character";
        charDiv.innerHTML = `
            <div class="character-icon" style="background:${characters[key].iconColor}"></div>
            ${characters[key].name}
        `;
        charDiv.onclick = () => openChat(key);
        characterList.appendChild(charDiv);
    }
}

function openChat(key) {
    currentCharacter = characters[key];
    headerName.textContent = currentCharacter.name;
    headerIcon.style.background = currentCharacter.iconColor;
    loadDialogue();
}

function loadDialogue() {
    chatBox.innerHTML = "";
    choiceBox.innerHTML = "";

    const scene = currentCharacter.dialogue[0];

    addMessage(scene.npc, "npc");

    scene.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = choice.text;
        btn.onclick = () => {
            addMessage(choice.text, "player");
            addMessage(choice.reply, "npc");
        };
        choiceBox.appendChild(btn);
    });
}

function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("chatHeader").onclick = () => {
    if (!currentCharacter) return;

    document.getElementById("profileName").textContent = currentCharacter.name;
    document.getElementById("profileDescription").textContent = currentCharacter.description;
    document.getElementById("profileIcon").style.background = currentCharacter.iconColor;

    document.getElementById("profileOverlay").classList.remove("hidden");
};

function closeProfile() {
    document.getElementById("profileOverlay").classList.add("hidden");
}

init();
