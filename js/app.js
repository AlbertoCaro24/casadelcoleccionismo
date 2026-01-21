// layor24 - Main App Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('layor24 app initialized');

    // Mobile Navbar Toggle (Future implementation)

    // Highlight active link based on URL
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});
