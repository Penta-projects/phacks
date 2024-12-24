import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, get, set, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCVIym8X-GDRx6_1256dtVZdo3hIm7TRgI",
  authDomain: "flipper-hack.firebaseapp.com",
  databaseURL: "https://flipper-hack-default-rtdb.firebaseio.com",
  projectId: "flipper-hack",
  storageBucket: "flipper-hack.appspot.com",
  messagingSenderId: "9118741906",
  appId: "1:9118741906:web:d8860d3094a46bafd37d4b",
  measurementId: "G-EYLLFHW5XS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let currentChatUser = null;
let currentUser = ""; // This will be set based on the user logged in

// Get the username from the URL parameters
const params = new URLSearchParams(window.location.search);
currentUser = params.get('user');

// Fetch users from the database and display in the user list
function loadUsers() {
  const usersRef = ref(database, "users");

  get(usersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const userListDiv = document.getElementById("user-list");
        userListDiv.innerHTML = ""; // Clear existing list

        for (const key in users) {
          const user = users[key];
          const userDiv = document.createElement("div");
          userDiv.classList.add("user");
          userDiv.setAttribute("data-username", key);
          userDiv.innerHTML = `<strong class="sender-name">${user.firstName} ${user.lastName}</strong>`;
          userDiv.innerHTML += `<div class="last-message">Loading last message...</div>`; // Placeholder for last message

          // Add click event to open chat for the selected user
          userDiv.addEventListener("click", () => {
            openChat(user.firstName, user.lastName, key);
          });

          userListDiv.appendChild(userDiv);

          // Listen for new messages for this user
          const chatRef = ref(database, `messages/${currentUser}_${key}`);
          onChildAdded(chatRef, (snapshot) => {
            const messageData = snapshot.val();
            if (messageData) {
              // Update the last message in the UI
              userDiv.querySelector(".last-message").innerHTML = messageData.text;
            }
          });
        }
      } else {
        alert("No user data found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data: ", error);
    });
}

// Function to open a chat with the selected user
// Function to open a chat with the selected user
function openChat(firstName, lastName, username) {
  currentChatUser = username;
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = ""; // Clear existing messages
  messagesDiv.innerHTML = `<h2 class="chat-with">Chatting with ${firstName} ${lastName}</h2>`;

  // Load existing messages for the current user
  const chatRef = ref(database, `messages/${username}_${currentUser}`);
  onChildAdded(chatRef, (snapshot) => {
    const messageData = snapshot.val();
    displayMessage(messageData.text, messageData.sender === currentUser ? 'sender' : 'receiver', messageData.timestamp);
  });

}

// Function to display a message in the chat
// Function to display a message in the chat
function displayMessage(text, type, timestamp) {
  const messagesDiv = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", type);

  // Format the timestamp
  const date = new Date(timestamp);
  const options = { hour: '2-digit', minute: '2-digit' };
  const formattedTimestamp = date.toLocaleTimeString([], options);

  messageElement.innerHTML = `
    <span class="message-text">${text}</span>
    <span class="timestamp">${formattedTimestamp}</span>
  `;

  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}


// Send message button functionality
// Send message button functionality
document.getElementById("sendButton").addEventListener("click", () => {
  const messageText = document.getElementById("chatInput").value;
  if (messageText.trim() !== "" && currentChatUser) {
    // Path for sender
    const senderMessageRef = ref(database, `messages/${currentUser}_${currentChatUser}`);
    // Path for receiver
    const receiverMessageRef = ref(database, `messages/${currentChatUser}_${currentUser}`);

    // Create a message object
    const messageObject = {
      text: messageText,
      sender: currentUser,
      receptor: currentChatUser, // Add receptor information
      timestamp: Date.now(),
    };

    // Store the message in both sender and receiver paths
    const newSenderMessageRef = push(senderMessageRef);
    const newReceiverMessageRef = push(receiverMessageRef);

    // Set the message in both paths
    set(newSenderMessageRef, messageObject).catch((error) => {
      console.error("Error sending message to sender: ", error);
    });

    set(newReceiverMessageRef, messageObject).catch((error) => {
      console.error("Error sending message to receiver: ", error);
    });

    // Clear the input field
    document.getElementById("chatInput").value = "";
  }
});


// Load users on page load
window.onload = function () {
  loadUsers();
};




/*
*user account ddrop down
*/
const userIcon = document.getElementById('userIcon');
const dropdownMenu = document.getElementById('dropdownMenu');

// Show dropdown on hover
userIcon.addEventListener('mouseenter', () => {
  dropdownMenu.style.display = 'block';
});

userIcon.addEventListener('mouseleave', () => {
  dropdownMenu.style.display = 'none';
});

// Optional: Close the dropdown when clicking outside
document.addEventListener('click', (event) => {
  if (!userIcon.contains(event.target)) {
    dropdownMenu.style.display = 'none';
  }
});

// Optional: Toggle dropdown on click
userIcon.addEventListener('click', () => {
  const isExpanded = userIcon.getAttribute('aria-expanded') === 'true';
  userIcon.setAttribute('aria-expanded', !isExpanded);
  dropdownMenu.style.display = isExpanded ? 'none' : 'block';
});

const notificationCount = document.getElementById("notification-count");

