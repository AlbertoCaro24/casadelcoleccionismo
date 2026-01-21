/**
 * Tracker Logic
 * Manages user collection state in LocalStorage
 * global scope version
 */

const STORAGE_PREFIX = 'layor24_tracker_';

window.Tracker = {
    getCollectionState: function (collectionSlug) {
        if (!collectionSlug) return { owned: [], missing: [], duplicates: {} };
        const data = localStorage.getItem(STORAGE_PREFIX + collectionSlug);
        let state = data ? JSON.parse(data) : { owned: [], missing: [], duplicates: {} };

        // Migration/Fix if duplicates is array
        if (Array.isArray(state.duplicates)) {
            state.duplicates = {};
        }
        return state;
    },

    saveCard: function (collectionSlug, cardId, isOwned) {
        if (!collectionSlug) return;
        const state = this.getCollectionState(collectionSlug);

        if (isOwned) {
            if (!state.owned.includes(cardId)) {
                state.owned.push(cardId);
            }
        } else {
            const index = state.owned.indexOf(cardId);
            if (index > -1) {
                state.owned.splice(index, 1);
            }
        }

        localStorage.setItem(STORAGE_PREFIX + collectionSlug, JSON.stringify(state));
        return state;
    },

    updateRepe: function (collectionSlug, cardId, change) {
        const state = this.getCollectionState(collectionSlug);

        // Initialize if not present
        if (!state.duplicates[cardId]) state.duplicates[cardId] = 0;

        // Apply change
        state.duplicates[cardId] += change;

        // Boundaries
        if (state.duplicates[cardId] < 0) state.duplicates[cardId] = 0;

        // Clean up 0s
        if (state.duplicates[cardId] === 0) delete state.duplicates[cardId];

        localStorage.setItem(STORAGE_PREFIX + collectionSlug, JSON.stringify(state));
        return state;
    },

    getRepeCount: function (collectionSlug, cardId) {
        const state = this.getCollectionState(collectionSlug);
        return state.duplicates[cardId] || 0;
    },

    isCardOwned: function (collectionSlug, cardId) {
        const state = this.getCollectionState(collectionSlug);
        return state.owned.includes(cardId);
    }
};
