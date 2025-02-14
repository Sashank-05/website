document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const menuItems = document.querySelectorAll('.menu-item');

    // Load initial page
    loadPage('home');

    // Menu click handler
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            loadPage(page);
        });
    });

    async function loadPage(page) {
        try {
            const response = await fetch(`${page}.html`);
            const html = await response.text();
            content.innerHTML = html;

            // Add active class to current menu item
            menuItems.forEach(item => {
                item.classList.remove('active');
                if(item.dataset.page === page) {
                    item.classList.add('active');
                }
            });

            // Update history
            history.pushState({ page }, null, `?page=${page}`);
        } catch (error) {
            content.innerHTML = `<h2>Error loading ${page}</h2>`;
        }
    }

    // Handle back/forward navigation
    window.addEventListener('popstate', (e) => {
        if(e.state) {
            loadPage(e.state.page);
        }
    });
});