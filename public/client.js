const socket = io();
let name;
let sendBtn = document.querySelector("#send-btn");
let messageArea = document.querySelector(".message-area");
let textarea = document.getElementById("textarea");
let emoji = document.querySelector('.emojionearea-editor');
let imageUploadInput = document.getElementById('image-upload');

// Text-Editor starts
const elements = document.querySelectorAll('.btn');
const content = document.querySelector('#textarea');

elements.forEach(element => {
    element.addEventListener('click', () => {
        let command = element.dataset['element'];
        if (command === "createLink" || command === "insertImage") {
            let url = prompt("Enter the link: ", "http://");
            document.execCommand(command, false, url);
        } else {
            document.execCommand(command, false, null);
        }
    });
});
// Text-editor ends

// Taking user name from prompt..
while (!name) {
    name = prompt("Please Enter your name");
}

// When pressing send btn..
sendBtn.addEventListener("click", function () {
    sendMessageIfNotEmpty();
});

// When pressing Enter key
textarea.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) { // Check if Enter is pressed
        event.preventDefault(); // Prevent default behavior (new line)
        sendMessageIfNotEmpty();
    }
});

// Handle image upload
imageUploadInput.addEventListener('change', function (event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let imageData = e.target.result;
            sendMessage(`<img src="${imageData}" class="chat-image"/>`);
        };
        reader.readAsDataURL(file);
    }
});

function sendMessageIfNotEmpty() {
    let x = textarea.innerHTML;
    if (x.trim() === "" && !document.querySelector('.chat-image')) {
        // Sweet Alert
        Swal.fire({
            title: "Alert!",
            text: "Message cannot be empty!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        });
    } else {
        sendMessage(x);
        textarea.textContent = "";
        document.querySelector('.chat-image')?.remove(); // Remove temporary image placeholder
    }
}

function sendMessage(enteredMessage) {
    // Creating and storing data in an object 'msg'
    let msg = {
        user: name,
        message: enteredMessage,
    };
    // Appending message to show it in our chatbox (outgoing)..
    appendMessage(msg, "outgoing"); // outgoing- type of msg
    scrollAuto();

    // Send to server
    socket.emit("messageEvent", msg);
}

// Appending our message in the message Area container..
function appendMessage(msg, type) {
    let msgDiv = document.createElement("div");
    let className = type; // (incoming or outgoing)
    msgDiv.classList.add(className, "message"); // Adding 2 classes ('incoming/outgoing', 'message' which we have created in HTML) to our msgDiv

    let namePlusMssg = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    msgDiv.innerHTML = namePlusMssg; // Inserting the data in our msgDiv..
    messageArea.appendChild(msgDiv); // Now appending the messages in our messageArea container..
}

// Receiving messages..
socket.on("messageEvent", function (msg) {
    appendMessage(msg, "incoming");
    scrollAuto();
});

// Automatic scroll
function scrollAuto() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
function appendMessage(msg, type) {
  let msgDiv = document.createElement("div");
  let className = type; // (incoming or outgoing)
  msgDiv.classList.add(className, "message"); // Adding 2 classes ('incoming/outgoing', 'message' which we have created in HTML) to our msgDiv

  // Get the current time
  let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let namePlusMssg = `
      <h4>${msg.user}</h4>
      <p>${msg.message}</p>
      <span class="timestamp">${currentTime}</span>  <!-- Adding timestamp -->
  `;
  msgDiv.innerHTML = namePlusMssg; // Inserting the data in our msgDiv..
  messageArea.appendChild(msgDiv); // Now appending the messages in our messageArea container..
}
