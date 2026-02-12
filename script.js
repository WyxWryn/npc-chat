document.getElementById("testBtn").addEventListener("click", () => {
  const chat = document.getElementById("chat");
  const p = document.createElement("p");
  p.textContent = "NPC: So, we finally talk.";
  chat.appendChild(p);
});
