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
