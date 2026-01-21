// Collections Page Logic
// Removed imports, using window.DB

document.addEventListener('DOMContentLoaded', async () => {
    const gridContainer = document.getElementById('collections-grid');

    // Fetch data using global DB
    const collections = await window.DB.getCollections();

    // Clear loading state
    gridContainer.innerHTML = '';

    if (collections.length === 0) {
        gridContainer.innerHTML = '<p class="error-msg">No se encontraron colecciones.</p>';
        return;
    }

    // Render cards
    collections.forEach(collection => {
        const card = createCollectionCard(collection);
        gridContainer.appendChild(card);
    });
});

function createCollectionCard(collection) {
    const article = document.createElement('article');
    article.className = 'collection-card';

    // Determine status badge color/text
    const isNew = new Date(collection.release_date) > new Date('2025-01-01');

    article.innerHTML = `
        <div class="card-image">
            <img src="${collection.cover_image}" alt="${collection.name}" onerror="this.src='https://placehold.co/300x400/112240/FFF?text=No+Image'">
            ${isNew ? '<span class="badge new">NUEVO</span>' : ''}
        </div>
        <div class="card-content">
            <div class="card-meta">
                <span class="publisher">${collection.publisher}</span>
                <span class="year">${collection.season}</span>
            </div>
            <h3>${collection.name}</h3>
            <p class="stats">
                <i class="fa-solid fa-layer-group"></i> ${collection.total_cards} Cartas
            </p>
            <a href="checklist.html?id=${collection.slug}" class="btn-primary full-width">
                Ver Checklist <i class="fa-solid fa-arrow-right"></i>
            </a>
        </div>
    `;

    return article;
}
