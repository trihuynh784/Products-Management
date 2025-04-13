// Hàm gửi lời mời kết bạn
const addFriend = (button) => {
  button.addEventListener("click", () => {
    const buttonSended = button.nextElementSibling;
    const userId = button.getAttribute("button-add-friend");

    buttonSended.classList.toggle("inactive");
    button.classList.add("d-none");
    socket.emit("CLIENT_ADD_FRIEND", userId);
  });
};

// Add friend
const buttonsAddFriend = document.querySelectorAll("button[button-add-friend]");
if (buttonsAddFriend) {
  buttonsAddFriend.forEach((button) => {
    addFriend(button);
  });
}
// End Add friend

// Hàm hủy lời mời
const cancelRequest = (button) => {
  button.addEventListener("click", () => {
    const userId = button.getAttribute("button-cancel-request");
    const buttonCanceledFriend = button.previousSibling;

    socket.emit("CLIENT_CANCEL_REQUEST", userId);
    buttonCanceledFriend.classList.toggle("inactive");
    button.classList.toggle("inactive");
  });
};

// Cancel Friend
const buttonsCancelFriend = document.querySelectorAll(
  "button[button-cancel-request]"
);
if (buttonsCancelFriend) {
  buttonsCancelFriend.forEach((button) => {
    cancelRequest(button);
  });
}
// End Cancel Friend

// Hàm đồng ý kết bạn
const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    const userId = button.getAttribute("button-accept-friend");
    const buttonAccepted = button.previousElementSibling;
    const buttonCancelAccept = button.nextElementSibling.nextElementSibling;

    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    buttonAccepted.classList.toggle("inactive");
    button.classList.toggle("inactive");
    buttonCancelAccept.classList.toggle("inactive");
  });
};

// Accept Friend
const buttonsAcceptFriend = document.querySelectorAll(
  "button[button-accept-friend]"
);
if (buttonsAcceptFriend) {
  buttonsAcceptFriend.forEach((button) => {
    acceptFriend(button);
  });
}
// End Accept Friend

// Hàm từ chối kết bạn
const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    const userId = button.getAttribute("button-cancel-accept");
    const buttonCanceledAccept = button.previousElementSibling;
    const buttonAccept = buttonCanceledAccept.previousElementSibling;

    socket.emit("CLIENT_CANCEL_ACCEPT", userId);
    buttonCanceledAccept.classList.toggle("inactive");
    buttonAccept.classList.toggle("inactive");
    button.classList.toggle("inactive");
  });
};

// Cancel Accept
const buttonsCancelAccept = document.querySelectorAll(
  "button[button-cancel-accept]"
);
if (buttonsCancelAccept) {
  buttonsCancelAccept.forEach((button) => {
    refuseFriend(button);
  });
}
// End Cancel Accept

// Hàm xóa kết bạn
const deleteFriend = (button) => {
  button.addEventListener("click", () => {
    const userId = button.getAttribute("button-delete-friend");
    const buttonDeletedFriend = button.previousElementSibling;

    socket.emit("CLIENT_DELETE_FRIEND", userId);
    buttonDeletedFriend.classList.toggle("inactive");
    button.classList.toggle("inactive");
  });
};

// Delete Friend
const buttonsDeleteFriend = document.querySelectorAll(
  "button[button-delete-friend]"
);
if (buttonsDeleteFriend) {
  buttonsDeleteFriend.forEach((button) => {
    deleteFriend(button);
  });
}
// End Delete Friend

// Server send length accept
const badgeAcceptFriend = document.querySelector(
  "[badge-length-accept-friend]"
);
if (badgeAcceptFriend) {
  socket.on("SERVER_SEND_LENGTH_ACCEPT_FRIEND", (data) => {
    const userId = badgeAcceptFriend.getAttribute("badge-length-accept-friend");
    if (userId == data.user_id) {
      badgeAcceptFriend.innerHTML = data.length_accept_friend
        ? data.length_accept_friend
        : "";
    }
  });
}
// End server send length accept

// Server send length request
const badgeRequestFriend = document.querySelector(
  "[badge-length-request-friend]"
);
if (badgeRequestFriend) {
  socket.on("SERVER_SEND_LENGTH_REQUEST_FRIEND", (data) => {
    const userId = badgeRequestFriend.getAttribute(
      "badge-length-request-friend"
    );
    if (userId == data.user_id) {
      badgeRequestFriend.innerHTML = data.length_request_friend
        ? data.length_request_friend
        : "";
    }
  });
}
// End Server send length request

// Server send length friends
const badgeFriends = document.querySelector("[badge-length-friends]");
if (badgeFriends) {
  socket.on("SERVER_SEND_LENGTH_FRIENDS", (data) => {
    const userId = badgeFriends.getAttribute("badge-length-friends");

    if (userId == data.user_id) {
      badgeFriends.innerHTML = data.length_friends ? data.length_friends : "";
    }
  });
}
// End Server send length friends

// Server return info user send request
const dataUsersAccept = document.querySelector("[data-users-accept]");
if (dataUsersAccept) {
  socket.on("SERVER_RETURN_INFO_USER_SEND_REQUEST", (data) => {
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    if (userId == data.user_id) {
      const isExistUserCard = document.querySelector(
        `[user-id="${data.infoUser._id}"]`
      );
      isExistUserCard?.remove();

      if (data.infoUser.avatar == "")
        data.infoUser.avatar = "/client/uploads/default-user.jpg";
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="user-card d-flex align-items-center justify-content-between" user-id=${data.infoUser._id}>
          <div class="d-flex align-items-center gap-3">
            <img class="avatar" src=${data.infoUser.avatar} alt="Avatar">
            <div>
              <div class="username">${data.infoUser.fullName}</div>
            </div>
          </div>
          <div>
            <span class="btn-sm btn-friend me-2 inactive" disabled>Cả 2 đã trở thành bạn bè</span>
            <button class="btn btn-success btn-sm btn-friend me-2" button-accept-friend=${data.infoUser._id}>Chấp nhận</button>
             <span class="btn-sm btn-friend me-2 inactive" disabled>Đã từ chối kết bạn</span>
            <button class="btn btn-outline-friend btn-sm btn-friend" button-cancel-accept=${data.infoUser._id}>Từ chối</button>
          </div>
        </div>
      `;

      // Hiển thị User gửi lời mời realtime
      dataUsersAccept.insertBefore(div, dataUsersAccept.firstChild);

      // Cài lại chức năng từ chối
      const buttonRefuse = div.querySelector("[button-cancel-accept]");
      refuseFriend(buttonRefuse);

      // Cài lại chức năng chấp nhận
      const buttonAccept = div.querySelector("[button-accept-friend]");
      acceptFriend(buttonAccept);
    }
  });
}
// End Server return info user send request

// Server return realtime cancel request
const cancelRequestRealtime = document.querySelector(`[data-users-accept]`);
if (cancelRequestRealtime) {
  socket.on("SERVER_RETURN_REALTIME_CANCEL_REQUEST", (data) => {
    const this_UserId = cancelRequestRealtime.getAttribute("data-users-accept");

    if (data.user_id_on == this_UserId) {
      const userCard = cancelRequestRealtime.querySelector(
        `[user-id="${data.user_id_emit}"]`
      );
      userCard.remove();
    }
  });
}
// End Server return realtime cancel request

// Server return realtime refuse accept
const refuseAcceptRealtime = document.querySelector(`[data-users-request]`);
if (refuseAcceptRealtime) {
  const this_UserId = refuseAcceptRealtime.getAttribute("data-users-request");
  socket.on("SERVER_RETURN_REALTIME_REFUSE_ACCEPT", (data) => {
    if (this_UserId == data.user_id_on) {
      const userCard = refuseAcceptRealtime.querySelector(
        `[user-id="${data.user_id_emit}"]`
      );

      userCard.remove();
    }
  });
}
// End Server return realtime refuse accept

// Server return realtime accept
const acceptRealtime = document.querySelector("[data-users-friends]");
if (acceptRealtime) {
  const this_UserId = acceptRealtime.getAttribute("data-users-friends");
  socket.on("SERVER_RETURN_REALTIME_ACCEPT", (data) => {
    if (this_UserId == data.user_id_on) {
      // Check xem đã có userCard chưa
      const isExistUserCard = document.querySelector(
        `[user-id="${data.infoUser_emit._id}"]`
      );
      isExistUserCard?.remove();

      // Vẽ ra giao diện
      if (data.infoUser_emit.avatar == "")
        data.infoUser_emit.avatar = "/client/uploads/default-user.jpg";
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="user-card d-flex align-items-center justify-content-between" user-id=${data.infoUser_emit._id}>
          <div class="d-flex align-items-center gap-3">
            <img class="avatar" src=${data.infoUser_emit.avatar} alt="Avatar">
            <div>
              <div class="username">${data.infoUser_emit.fullName}</div>
              <div class="user-status" status=${data.infoUser_emit.statusOnline}>Đang hoạt động</div>
            </div>
          </div>
          <div>
            <a class="btn btn-primary btn-sm btn-friend me-2" href=`/chat/${data.room_chat_id}`>Nhắn tin</a>
            <span class="btn-sm btn-friend me-2 inactive" disabled>Đã hủy kết bạn</span>
            <button class="btn btn-danger btn-sm btn-friend me-2" button-delete-friend=${data.infoUser_emit._id}>Xóa kết bạn</button>
          </div>
        </div>
      `;

      // Hiển thị User gửi lời mời realtime
      acceptRealtime.insertBefore(div, acceptRealtime.firstChild);

      // Cài lại chức năng xóa kết bạn
      deleteFriend(div.querySelector("button[button-delete-friend]"));
    }
  });
}
// End Server return realtime accept

// Hiển thị lại người dùng B ở no-friend A khi B từ chối kết bạn
const refuseAccept_notFriend = document.querySelector(
  "[data-users-not-friend]"
);
if (refuseAccept_notFriend) {
  const myUserId = refuseAccept_notFriend.getAttribute("data-users-not-friend");
  socket.on("SERVER_RETURN_REALTIME_NOT_FRIEND_WHEN_DELETE_FRIEND", (data) => {
    if (myUserId == data.user_id_on) {
      // Check xem đã có userCard chưa
      const isExistUserCard = document.querySelector(
        `[user-id="${data.infoUser_emit._id}"]`
      );
      isExistUserCard?.remove();

      // Vẽ ra giao diện
      if (data.infoUser_emit.avatar == "")
        data.infoUser_emit.avatar = "/client/uploads/default-user.jpg";
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="user-card d-flex align-items-center justify-content-between" user-id=${data.infoUser_emit._id}>
          <div class="d-flex align-items-center gap-3">
            <img class="avatar" src=${data.infoUser_emit.avatar} alt="Avatar">
            <div>
              <div class="username">${data.infoUser_emit.fullName}</div>
            </div>
          </div>
          <div>
            <button class="btn btn-primary btn-sm btn-friend me-2" button-add-friend=${data.infoUser_emit._id}>Kết bạn</button>
            <button class="btn btn-secondary btn-sm btn-friend me-2 inactive" button-sended-friend>Đã gửi</button>
          </div>
        </div>
      `;

      // Insert card của B vào lại bên A
      refuseAccept_notFriend.insertBefore(
        div,
        refuseAccept_notFriend.firstChild
      );

      // Cài lại chức năng gửi lời mời kết bạn
      addFriend(div.querySelector("[button-add-friend]"));
    }
  });
}
// End Hiển thị lại người dùng B ở no-friend A khi B từ chối kết bạn

// Khi A gửi kết bạn sẽ xóa đi A bên not-friend B
const eraseCard_notFriend = document.querySelector("[data-users-not-friend]");
if (eraseCard_notFriend) {
  const myUserId = eraseCard_notFriend.getAttribute("data-users-not-friend");
  socket.on("SERVER_RETURN_REALTIME_ERASE_CARD_NOT_FRIEND", (data) => {
    if (myUserId == data.user_id_on) {
      const isExistCard = eraseCard_notFriend.querySelector(
        `[user-id="${data.user_id_emit}"]`
      );
      isExistCard?.remove();
    }
  });
}
// End Khi A gửi kết bạn sẽ xóa đi A bên not-friend B

// Khi A hủy kết bạn sẽ xóa A bên phía friend của B
const eraseCard_friend = document.querySelector("[data-users-friends]");
if (eraseCard_friend) {
  const myUserId = eraseCard_friend.getAttribute("data-users-friends");
  socket.on("SERVER_RETURN_REALTIME_FRIEND_WHEN_DELETE_FRIEND", (data) => {
    if (myUserId == data.user_id_on) {
      const isExistCard = eraseCard_friend.querySelector(
        `[user-id="${data.user_id_emit}"]`
      );
      isExistCard?.remove();
    }
  });
}
// End Khi A hủy kết bạn sẽ xóa A bên phía friend của B

// Tag online/offline realtime
socket.on("SERVER_RETURN_USER_ONLINE/OFFLINE", (data) => {
  const userIdElement = document.querySelector("[data-users-friends]");
  if (userIdElement) {
    const cardUserId = userIdElement.querySelector(
      `[user-id="${data.user_id}"]`
    );
    if (cardUserId) {
      const statusOnlineTag = cardUserId.querySelector("[status]");
      statusOnlineTag.setAttribute("status", data.status);
      statusOnlineTag.innerHTML =
        data.status == "online" ? "Đang hoạt động" : "Ngoại tuyến";
    }
  }
});
// End Tag online realtime