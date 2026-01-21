const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets/img/NO_LISTADOS_ESPECIALES_OCULTOS');
const files = fs.readdirSync(dir).filter(f => !f.startsWith('axl26-'));

// Map to known abbreviations for order or just alphabetical
// AOPDS, ELDJ, ELH, ELNG, EXGDLY, EXGDMB, MAG, MEE, MIA, MIAA, MIOP, MK, MMEC, MP
// Alphabetical seems fine.

files.sort();

let count = 0;
files.forEach((file, index) => {
    const ext = path.extname(file).toLowerCase();
    const newName = `axl26-S-${index + 1}${ext}`; // axl26-S-1.webp
    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, newName);

    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${file} -> ${newName}`);
    count++;
});

console.log(`Processed ${count} secret files.`);
