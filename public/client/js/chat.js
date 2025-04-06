import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT SEND TO SERVER
const formChat = document.querySelector(".chat .inner-form");
if (formChat) {
  formChat.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}
// End CLIENT SEND TO SERVER

// SERVER RETURN FOR CLIENT
socket.on("SERVER_RETURN_MESSAGE", (obj) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const bodyChat = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");
  div.classList.add(myId == obj.user_id ? "inner-outgoing" : "inner-incoming");
  let fullName = "";
  if (myId != obj.user_id)
    fullName = `<div class="inner-name">${obj.fullName}</div>`;
  div.innerHTML = `
    ${fullName}
    <div class="inner-content">${obj.content}</div>
  `;
  bodyChat.appendChild(div);
  bodyChat.scrollTop = bodyChat.scrollHeight;
});
// END SERVER RETURN FOR CLIENT

// Set chat when loading must to bottom
const bodyChatToBottom = document.querySelector(".chat .inner-body");
if (bodyChatToBottom) {
  bodyChatToBottom.scrollTop = bodyChatToBottom.scrollHeight;
}
// End set chat when loading must to bottom

// Emoji Picker
const buttonIcons = document.querySelector("span.btn-icons");
if (buttonIcons) {
  // Button tooltip
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcons, tooltip);
  buttonIcons.addEventListener("click", () => {
    tooltip.classList.toggle("shown");
  });

  // Add icon into input
  const emojiPicker = tooltip.querySelector("emoji-picker");
  if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input");
    emojiPicker.addEventListener("emoji-click", (event) => {
      inputChat.value += event.detail.unicode;
    });
  }
}
// End Emoji Picker

// Typing 
  // Emit typing to server
const inputChat = document.querySelector(".chat .inner-form input");
if (inputChat) {
  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", "typing");
  })
}

  // On typing from server
socket.on("SERVER_RETURN_TYPING", (objTyping) => {
  console.log(objTyping);
})
// End Typing