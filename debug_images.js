const fs = require('fs');
const path = require('path');

// Import the data from generate_db.js (simulated or read)
// I'll just copy the TEAMS_DATA structure setup or read the file?
// Simpler to just list folders and counts.

const assetsDir = path.join(__dirname, 'assets/img');

// We know the folders from the known list, or we scan all directories.
const folders = fs.readdirSync(assetsDir).filter(f => fs.statSync(path.join(assetsDir, f)).isDirectory());

console.log("--- FILE COUNTS PER FOLDER ---");

let globalTotal = 0;

folders.forEach(folder => {
    if (folder === 'cards' || folder === 'icons') return; // interact only with team-like folders

    const files = fs.readdirSync(path.join(assetsDir, folder));
    const webpFiles = files.filter(f => f.endsWith('.webp') && f.startsWith('axl26-'));

    // Attempt to extract numbers to see range
    // axl26-199.webp
    const numbers = webpFiles.map(f => {
        const match = f.match(/axl26-(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }).sort((a, b) => a - b);

    const min = numbers.length ? numbers[0] : 0;
    const max = numbers.length ? numbers[numbers.length - 1] : 0;

    console.log(`Folder: ${folder.padEnd(20)} | Count: ${webpFiles.length.toString().padEnd(3)} | Range: ${min} - ${max}`);

    // Check for gaps
    // if (numbers.length > 0) {
    //    for (let i = 0; i < numbers.length - 1; i++) {
    //        if (numbers[i+1] !== numbers[i] + 1) {
    //            console.log(`    !!! GAP in ${folder}: ${numbers[i]} -> ${numbers[i+1]}`);
    //        }
    //    }
    // }
});
