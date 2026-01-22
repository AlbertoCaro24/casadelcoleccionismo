// Checklist Page Logic (Redesigned for Teams Navigation)
const urlParams = new URLSearchParams(window.location.search);
const collectionSlug = urlParams.get('id');

// Global state
let allCards = [];
let groupedData = {}; // { "Real Madrid": [cards...], "¡Vamos!": [cards...] }
let orderedGroupNames = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (!collectionSlug) {
            console.warn("No ID provided, redirecting...");
            // window.location.href = 'index.html'; // Stay here for debug
            document.getElementById('collection-title').textContent = 'Error: No ID provided';
            return;
        }

        console.log("Fetching collections...");
        const collections = await window.DB.getCollections();
        console.log("Collections:", collections);

        if (!collections || collections.length === 0) {
            throw new Error("No collections data found in DB.");
        }

        const collection = collections.find(c => c.slug === collectionSlug);
        console.log("Searching for slug:", collectionSlug, "Found:", collection);

        if (!collection) {
            document.getElementById('collection-title').textContent = 'Colección no encontrada (' + collectionSlug + ')';
            return;
        }

        // Load data
        console.log("Fetching cards...");
        allCards = await window.DB.getCollectionCards(collectionSlug);
        console.log("Cards loaded:", allCards.length);

        if (!allCards || allCards.length === 0) {
            document.getElementById('collection-title').textContent = collection.name + ' (Sin Cartas)';
        }

        // Group Data by Team or Special Category
        groupCards(allCards);

        // UI Update
        document.getElementById('collection-name-bread').textContent = collection.name;
        document.getElementById('collection-title').textContent = collection.name;

        renderTeamSelection(); // Initial View
        updateProgress(allCards.length);
    } catch (e) {
        console.error("Initialization Error:", e);
        document.getElementById('collection-title').textContent = 'Error: ' + e.message;
        document.getElementById('teams-grid').innerHTML = '<div style="color:red; grid-column: 1/-1;">' + e.message + '</div>';
    }
});

function groupCards(cards) {
    groupedData = {};
    orderedGroupNames = []; // Reset order

    cards.forEach(card => {
        // Decide grouping: Use 'Team' for base cards, 'Category/Rarity' name for specials if needed
        let groupName = card.team;

        if (card.category !== 'base') {
            // Group by Category (e.g., ¡Vamos!, Super Crack)
            groupName = card.rarity;
        }

        if (!groupedData[groupName]) {
            groupedData[groupName] = [];
            // Push to order list ONLY on first encounter
            orderedGroupNames.push(groupName);
        }

        groupedData[groupName].push(card);
    });
}

function renderTeamSelection() {
    const teamsGrid = document.getElementById('teams-grid');
    const cardsGrid = document.getElementById('checklist-grid');
    const backBtn = document.getElementById('btn-back-teams');

    // Show Teams, Hide Cards
    teamsGrid.style.display = 'grid'; // Restore grid layout
    cardsGrid.style.display = 'none';
    backBtn.style.display = 'none';

    // Clear previous content
    teamsGrid.innerHTML = '';
    cardsGrid.innerHTML = ''; // Clear cards too to save memory/DOM

    // Use preserved order (Numerical / Checklist order)
    const groups = orderedGroupNames;

    groups.forEach(groupName => {
        const groupCards = groupedData[groupName];
        const count = groupCards.length;
        const isSpecial = groupCards[0].category !== 'base';

        // Find Image to display
        // Priority: Explicit team_logo -> First card image -> Fallback
        let imageUrl = groupCards[0].team_logo; // Use new property if available

        if (!imageUrl) {
            imageUrl = groupCards[0].image;
        }

        // Fallback for special cards that don't have team_logo maybe?
        // Actually, only base teams have team_logo set in my update.
        // For specials, we might want their card image (e.g. "¡Vamos!").

        if (isSpecial) {
            imageUrl = groupCards[0].image;
        }

        // Fallback if no image property (shouldn't happen with new DB)
        if (!imageUrl) {
            imageUrl = `assets/img/cards/${groupCards[0].id}.png`;
        }

        const ownedCount = groupCards.filter(card => window.Tracker.isCardOwned(collectionSlug, card.id)).length;
        const isComplete = ownedCount === count;

        const el = document.createElement('div');
        el.className = `team-selector-card ${isSpecial ? 'special-series' : ''} ${isComplete ? 'completed' : ''}`;
        el.onclick = () => showCardsForGroup(groupName);

        el.innerHTML = `
            <div class="team-logo-container">
                 <img src="${imageUrl}" alt="Logo del equipo ${groupName}" loading="lazy"
                     onerror="this.src='assets/img/cards/placeholder_shield.jpg'">
                <i class="fa-solid ${isSpecial ? 'fa-star' : 'fa-shield-halved'} fallback-icon" style="display:none; font-size: 2rem; color: var(--color-orange);"></i>
            </div>
            <div class="team-name">${groupName}</div>
            <div class="team-count">${ownedCount}/${count} Cartas ${isComplete ? '<br><span style="color: #00ff00; font-size: 0.8em;">(COMPLETADO)</span>' : ''}</div>
        `;

        teamsGrid.appendChild(el);
    });
}

function showCardsForGroup(groupName) {
    const teamsGrid = document.getElementById('teams-grid');
    const cardsGrid = document.getElementById('checklist-grid');
    const backBtn = document.getElementById('btn-back-teams');

    // Hide Teams, Show Cards
    teamsGrid.style.display = 'none';
    cardsGrid.style.display = 'grid'; // Grid layout
    backBtn.style.display = 'inline-flex';

    renderChecklist(groupedData[groupName]);

    // Fix: Scroll to top of the cards/page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Exposed for the back button in HTML
window.showTeamSelection = renderTeamSelection;

function renderChecklist(cardsToRender) {
    const grid = document.getElementById('checklist-grid');
    grid.innerHTML = '';

    cardsToRender.forEach(card => {
        const isOwned = window.Tracker.isCardOwned(collectionSlug, card.id);

        const el = document.createElement('div');
        el.className = `check-card item-${card.id}`;
        if (isOwned) el.classList.add('owned');

        const imageUrl = card.image || `assets/img/cards/${card.id}.jpg`;

        el.innerHTML = `
            <div class="card-visual rarity-${card.category}">
                 <!--Card Image with fallback-->
                <img src="${imageUrl}" class="card-img-real" alt="Carta #${card.number} ${card.name} del ${card.team}" loading="lazy" onerror="this.onerror=null;this.src='assets/img/cards/placeholder_player.jpg';">
                <div class="card-placeholder" style="display:none;">
                    <span class="card-number">#${card.number}</span>
                </div>
                
                <div class="card-status-icon">
                    <i class="fa-solid fa-check"></i>
                </div>
            </div>
            
            <div class="card-info">
                <div class="card-name">#${card.number} ${card.name}</div>
                <div class="card-sub">${card.team}</div>
            </div>

            <div class="card-actions">
                <button class="btn-action action-album full-width ${isOwned ? 'active' : ''}" onclick="toggleAlbum('${card.id}')" data-tippy-content="Haz clic para marcar como obtenida">
                    <i class="fa-solid fa-book"></i> Álbum
                </button>
            </div>
        `;
        grid.appendChild(el);
    });
}

// Global functions for onclick handlers
window.toggleAlbum = function (cardId) {
    const cardEl = document.querySelector(`.item-${cardId}`);
    const isOwned = cardEl.classList.contains('owned'); // Current state

    // Toggle state
    const newState = !isOwned;
    window.Tracker.saveCard(collectionSlug, cardId, newState);

    // Update UI
    if (newState) {
        cardEl.classList.add('owned');
        cardEl.querySelector('.action-album').classList.add('active');
        showToast('Carta marcada en Álbum');
    } else {
        cardEl.classList.remove('owned');
        cardEl.querySelector('.action-album').classList.remove('active');
    }

    // Recalculate progress (need full cards list for this, using global length)
    updateProgress(allCards.length);
}

function updateProgress(totalCards) {
    const state = window.Tracker.getCollectionState(collectionSlug);
    const ownedCount = state.owned.length;
    const percentage = Math.floor((ownedCount / totalCards) * 100);

    document.getElementById('progress-text').textContent = `${ownedCount} / ${totalCards} (${percentage}%)`;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', () => {
    tippy('[data-tippy-content]', {
        theme: 'light',
        placement: 'top',
        trigger: 'click',
    });
});
