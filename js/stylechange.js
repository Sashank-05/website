function changeStyle(sheet) {
    const linkElement = document.querySelector('link[rel="stylesheet"]');

    if (linkElement) {
        // change onclick of a button
        const oncButton = document.getElementById('anotherButton');
        // change to old current sheet
        oncButton.setAttribute('onclick', `changeStyle('${linkElement.href}')`);

        linkElement.setAttribute('href', sheet);
        console.log(`Stylesheet changed to: ${sheet}`);
    } else {
        console.error("Stylesheet link element not found.");
    }
}

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.add('light-mode');
}



if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    document.getElementById('darkModeToggle').textContent = 'Light Mode'; // Set initial text to "Light Mode"
} else {
    document.body.classList.add('light-mode');
    document.getElementById('darkModeToggle').textContent = 'Dark Mode'; // Set initial text to "Dark Mode"
}

// Toggle dark mode manually and update button text
function toggleDarkMode() {
    const button = document.getElementById('darkModeToggle');
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        button.textContent = 'Dark Mode'; // Change text to "Dark Mode"
    } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        button.textContent = 'Light Mode'; // Change text to "Light Mode"
    }
}

// Optionally, store theme preference in localStorage
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const button = document.getElementById('darkModeToggle');
    if (savedTheme) {
        document.body.classList.remove('dark-mode', 'light-mode');
        document.body.classList.add(savedTheme);
        button.textContent = savedTheme === 'dark-mode' ? 'Light Mode' : 'Dark Mode'; // Set button text based on saved theme
    }
}

function saveThemePreference() {
    const theme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', theme);
}

// Example usage: toggleDarkMode(); to be called from a button or event listener
document.getElementById('darkModeToggle').addEventListener('click', function() {
    toggleDarkMode();
    saveThemePreference();
});

// Load saved preference on page load
loadThemePreference();

document.addEventListener("DOMContentLoaded", function() {
    const nameElement = document.getElementById('name');
    const topContent = document.getElementById('topcontent');

    nameElement.addEventListener('animationend', function() {
        topContent.style.opacity = '1';
        topContent.style.transition = 'opacity 0.5s ease';
    });
});