import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

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

// Get the username from local storage
const storedUsername = localStorage.getItem("username");

// Function to fetch user data
function fetchUserData(username) {
    const userRef = ref(database, `users/${username}`);
    return get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val(); // Returns the user data
        } else {
            console.error("No user data found.");
            return null; // Ensure null is returned
        }
    }).catch((error) => {
        console.error("Error fetching user data: ", error);
        return null; // Ensure null is returned on error
    });
}

// Function to fetch user data for all members
function fetchAllMembersData() {
    const membersRef = ref(database, 'users'); // Reference to the users node
    return get(membersRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val(); // Returns all users data
        } else {
            console.error("No members data available");
            return null; // Ensure null is returned
        }
    }).catch((error) => {
        console.error("Error fetching members data: ", error);
        return null; // Ensure null is returned on error
    });
}

// Function to display members data in the UI
// Function to display members data
function displayMembersData(membersData) {
    const membersList = document.querySelector(".members-list");
    membersList.innerHTML = ""; // Clear existing members list

    for (let username in membersData) {
        const memberData = membersData[username];
        const listItem = document.createElement("li");
        listItem.classList.add("member-item");
        listItem.textContent = `${memberData.firstName} ${memberData.lastName}`;

        // Check if the user is an admin
        listItem.innerHTML += ` <span class="member-role">(${memberData.role})</span>`;

        fetchUserData(storedUsername).then(userData => {
            if (userData) {
                // Do something with the user data
                document.getElementById("firstnameNlastname")
                    .innerHTML = `${userData.firstName} ${userData.lastName}`;
                document.getElementById("userName")
                    .innerHTML = userData.username;
                document.getElementById("security-code")
                    .innerHTML = userData.securityCode;
            }
        });
        membersList.appendChild(listItem);
    }
}

// Function to handle fetching user data on page load
window.onload = () => {
    // Fetch individual user data
    fetchUserData(storedUsername).then(userData => {
        if (userData) {
            // Do something with the user data
            document.getElementById("firstnameNlastname")
                .innerHTML = `${userData.firstName} ${userData.lastName}`;
            document.getElementById("userName")
                .innerHTML = userData.username;
            document.getElementById("security-code")
                .innerHTML = userData.securityCode;
        }
    });

    fetchUserData(storedUsername).then(userData => {
        if (userData) {
            // Do something with the user data
            document.getElementById("firstnameNlastname")
                .innerHTML = `${userData.firstName} ${userData.lastName}`;
            document.getElementById("userName")
                .innerHTML = userData.username;
            document.getElementById("security-code")
                .innerHTML = userData.securityCode;
        }
    });
    // Fetch all members data and display it on page load
    fetchAllMembersData().then(membersData => {
        if (membersData) {
            displayMembersData(membersData);
        }
    });
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