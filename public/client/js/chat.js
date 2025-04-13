import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
import { FileUploadWithPreview } from "https://cdnjs.cloudflare.com/ajax/libs/file-upload-with-preview/6.1.2/index.min.js";

// File upload with preview
const upload = new FileUploadWithPreview("upload-images", {
  multiple: true,
  maxFileCount: 10,
});

// CLIENT SEND TO SERVER
const formChat = document.querySelector(".chat .inner-form");
if (formChat) {
  formChat.addEventListener("submit", (e) => {
    e.preventDefault();
    const images = upload.cachedFileArray;
    const content = e.target.elements.content.value;
    if (content || images.length) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });
      e.target.elements.content.value = "";
      upload.resetPreviewPanel();
      socket.emit("CLIENT_SEND_TYPING", "stop-typing");
    }
  });
}
// End CLIENT SEND TO SERVER

// SERVER RETURN FOR CLIENT
socket.on("SERVER_RETURN_MESSAGE", (obj) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const bodyChat = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");
  const listTyping = document.querySelector(
    ".chat .inner-body .inner-list-typing"
  );
  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";
  div.classList.add(myId == obj.user_id ? "inner-outgoing" : "inner-incoming");
  if (myId != obj.user_id)
    htmlFullName = `<div class="inner-name">${obj.fullName}</div>`;

  if (obj.content) {
    htmlContent += `<div class="inner-content">${obj.content}</div>`;
  }

  if (obj.images.length) {
    htmlImages += `<div class="inner-images">`;
    for (const image of obj.images) {
      htmlImages += `<img src=${image}>`;
    }
    htmlImages += `</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `;

  bodyChat.insertBefore(div, listTyping);
  new Viewer(div, {
    title: false,
  });
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
var timeout;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "typing");
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "stop-typing");
  }, 3000);
};

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
      const icon = event.detail.unicode;
      const start = inputChat.selectionStart;
      const end = inputChat.selectionEnd;

      inputChat.value =
        inputChat.value.substring(0, start) +
        icon +
        inputChat.value.substring(end);

      inputChat.setSelectionRange(start + icon.length, start + icon.length);
      inputChat.focus();

      // Set typing icons
      showTyping();
    });

    // Client send typing
    inputChat.addEventListener("keyup", () => {
      showTyping();
    });
  }
}
// End Emoji Picker

// Server return typing
socket.on("SERVER_RETURN_TYPING", (objTyping) => {
  const listTyping = document.querySelector(".chat .inner-list-typing");
  if (objTyping.type == "typing") {
    const isExistUserId = listTyping.querySelector(
      `.typing-item[user-id="${objTyping.user_id}"]`
    );
    if (!isExistUserId) {
      const typingItem = document.createElement("div");
      typingItem.classList.add("typing-item");
      typingItem.setAttribute("user-id", objTyping.user_id);
      typingItem.innerHTML = `
        <div class="typing-item" id=${objTyping.user_id}>
          <div class="username">${objTyping.fullName}</div>
          <div class="typing-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      `;
      listTyping.appendChild(typingItem);
      bodyChatToBottom.scrollTop = bodyChatToBottom.scrollHeight;
    }
  } else if (objTyping.type == "stop-typing") {
    const typingItem = listTyping.querySelector(
      `.typing-item[user-id="${objTyping.user_id}"]`
    );

    if (typingItem) {
      listTyping.removeChild(typingItem);
    }
  }
});

// ViewersJS
const bodyChatPreviewImage = document.querySelector(".chat .inner-body");
if (bodyChatPreviewImage) {
  new Viewer(bodyChatPreviewImage, {
    title: false,
  });
}
// End ViewersJS
