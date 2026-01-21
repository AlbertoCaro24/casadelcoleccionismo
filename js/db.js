/**
 * layor24 Database Service
 * Global scope version - reads from window objects
 */

window.DB = {
    getCollections: async function () {
        // Simulate async to keep API consistent even though it's instant now
        return new Promise(resolve => {
            setTimeout(() => {
                if (window.COLLECTIONS_DATA) {
                    resolve(window.COLLECTIONS_DATA);
                } else {
                    console.error('COLLECTIONS_DATA not found. Make sure collections_data.js is loaded.');
                    resolve([]);
                }
            }, 100);
        });
    },

    getCollectionCards: async function (collectionSlug) {
        return new Promise(resolve => {
            setTimeout(() => {
                // In a real production app with file://, we would dynamically inject the script tag here
                // For this MVP, we assume the script is loaded in the HTML page.
                if (window.CARDS_DATA) {
                    resolve(window.CARDS_DATA);
                } else {
                    console.error('CARDS_DATA not found. Make sure the specific collection DB js file is loaded.');
                    resolve([]);
                }
            }, 100);
        });
    }
};
