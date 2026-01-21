const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---

const ASSETS_DIR = path.join(__dirname, 'assets', 'img');

// 1. Teams Map (Order doesn't matter for *finding* folders, but renaming relies on file content numbers)
// actually, if the files are already numbered 019... 020..., I can just trust the file number!
// verifying: alaves was 001..018. bilbao is 019..036.
// SO: I just need to regex the filename for the number!
// "019_..." -> axl26-19
// "019BIS_..." -> axl26-19b

// I don't even need to map teams to folders strictly if I just traverse all known folders and rename based on the file's OWN prefix.
// However, I should iterate specific folders to avoid messing up other things.

const TEAM_FOLDERS = [
    "alaves", "bilbao", "atletico_de_madrid", "barcelona", "betis", "celta", "elche", "espanyol",
    "getafe", "girona", "levante", "real_madrid", "mallorca", "osasuna", "oviedo", "rayo_vallecano",
    "real_sociedad", "sevilla", "valencia", "villarreal"
];

const SPECIAL_FOLDERS = [
    "VAMOS", "GUANTES_DE_ORO", "KRYPTONITA", "DIAMANTES", "INFLUENCERS", "PROTAS", "SUPER_CRACKS",
    "CARD_CHAMPIONS", "BALON_DE_ORO", "CARD_ATOMICA", "CARD_INVENCIBLE", "CAMPEON_CARD", "NEWMASTERS"
];

// --- LOGIC ---

function processFolder(folderName) {
    const dirPath = path.join(ASSETS_DIR, folderName);
    if (!fs.existsSync(dirPath)) {
        console.log(`Skipping missing folder: ${folderName}`);
        return;
    }

    const files = fs.readdirSync(dirPath);
    let count = 0;

    files.forEach(file => {
        if (!file.endsWith('.webp') && !file.endsWith('.jpg') && !file.endsWith('.png')) return;

        // Skip already renamed files (axl26-...)
        if (file.startsWith('axl26-')) return;

        // Match Patterns:
        // 1. "019..." -> match[1]=019 (Teams)
        // 2. "NM1..." -> match[1]=1 (New Masters)
        // 3. "NM10..." -> match[1]=10

        // Regex: 
        // ^(\d+)(BIS)?  matches "019BIS"
        // ^NM(\d+)      matches "NM1"

        let num = null;
        let isBis = false;

        const matchDigits = file.match(/^(\d+)(BIS)?/i);
        const matchNM = file.match(/^NM(\d+)/i);

        if (matchDigits) {
            num = parseInt(matchDigits[1], 10);
            if (matchDigits[2]) isBis = true;
        } else if (matchNM) {
            num = parseInt(matchNM[1], 10);
        }

        if (num !== null) {
            // New Name
            let newName = `axl26-${num}`;
            if (isBis) newName += 'b';

            // Extension: maintain original (lowercase)
            const ext = path.extname(file).toLowerCase();
            const finalName = `${newName}${ext}`;

            const oldPath = path.join(dirPath, file);
            const newPath = path.join(dirPath, finalName);

            // Check collision
            if (fs.existsSync(newPath)) {
                // Duplicate handling logic
                // If source and dest are different files (e.g. UUID duplicate vs renamed file)
                // The user had "NM6...uuid..." and "NM6..."
                // If "NM6..." got renamed first to "axl26-6.webp", then "NM6...uuid..." tries to become "axl26-6.webp".
                // We should SKIP the second one.
                // console.log(`Skipping ${file} -> ${finalName} (Exists)`);
            } else {
                fs.renameSync(oldPath, newPath);
                count++;
            }
        }
    });
    console.log(`Processed ${folderName}: ${count} renamed.`);
}

console.log("--- Starting Rename Process ---");
[...TEAM_FOLDERS, ...SPECIAL_FOLDERS].forEach(folder => {
    processFolder(folder);
});
console.log("--- Completed ---");
