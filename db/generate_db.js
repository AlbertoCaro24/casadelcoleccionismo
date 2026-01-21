const fs = require('fs');
const path = require('path');

// --- DATA SOURCE (From Checklist 2025-26 Updates) ---

const TEAMS_DATA = {
    "Deportivo Alavés": [
        "Escudo",
        "Carta de Estadio - Mendizorroza", // Bis
        "Sivera", "Raúl Fernández", "Johny", "Tenaglia", "Pacheco", "Parada", "Moussa diarra", "Blanco", "Guevara", "Gutidi", "Aleñá", "Pablo Ibáñez", "Denis Suárez", "Carlos Vicente", "Toni martínez", "Boyé", "Mariano"
    ],
    "Athletic Club": [
        "Escudo",
        "Carta de Estadio - San Mamés", // Bis
        "Unai Simón", "Padilla", "Areso", "Vivian", "Paredes", "Laporte", "Yuri", "Ruiz de Galarreta", "Jauregizar", "Vesga", "Unai Gómez", "Sancet", "Berenguer", "Williams", "Maroan", "Guruzeta", "Nico Williams"
    ],
    "Atlético de Madrid": [
        "Escudo",
        "Carta de Estadio - Riyadh Air Metropolitano", // Bis
        "Oblak", "Musso", "Marcos Llorente", "Le Normand", "Lenglet", "Hancko", "Riquelme", "Koke", "Barrios", "Gallagher", "Álex Baena", "Almada", "Nico González", "Giuliano", "Julián Álvarez", "Sørloth", "Griezmann"
    ],
    "FC Barcelona": [
        "Escudo",
        "Carta de Estadio - Spotify Camp Nou", // Bis
        "Joan García", "Szczęsny", "Koundé", "Cubarsí", "Eric García", "Araújo", "Balde", "De Jong", "Gavi", "Pedri", "Fermín", "Dani Olmo", "Raphinha", "Lamine Yamal", "Ferran Torres", "Lewandowski", "Rashford"
    ],
    "Real Betis": [
        "Escudo",
        "Carta de Estadio - La Cartuja", // Bis
        "Pau López", "Valles", "Bellerín", "Bartra", "Diego Llorente", "Natan", "Valentín Gómez", "Junior", "Altimira", "Amrabat", "Pablo Fornals", "Lo Celso", "Isco", "Antony", "Cucho Hernández", "Riquelme", "Abde"
    ],
    "RC Celta": [
        "Escudo",
        "Carta de Estadio - Abanca Balaídos", // Bis
        "Radu", "Iván Villar", "Javi Rueda", "Javi Rodríguez", "Starfelt", "Marcos Alonso", "Mingueza", "Carreira", "Ilaix Moriba", "Fran Beltrán", "Sotelo", "Hugo Álvarez", "Swedberg", "Bryan Zaragoza", "Iago Aspas", "Borja Iglesias", "Jutglà"
    ],
    "Elche CF": [
        "Escudo",
        "Carta de Estadio - Martínez Valero", // Bis
        "Iñaki Peña", "Dituro", "Álvaro Núñez", "Chust", "Bigas", "Affengruber", "Pedrosa", "Fede Redondo", "Germán Valera", "Martim Neto", "Febas", "Marc Aguado", "Rodri Mendoza", "Josan", "Álvaro Rodríguez", "André Silva", "Rafa Mir"
    ],
    "RCD Espanyol": [
        "Escudo",
        "Carta de Estadio - RCDE Stadium", // Bis
        "Dmitrovic", "Fortuño", "El Hilali", "Calero", "Riedel", "Cabrera", "Carlos Romero", "Pol Lozano", "Urko", "Edu Expósito", "Terrats", "Antoniu Roca", "Dolan", "Roberto Fernández", "Kike García", "Puado", "Pere Milla"
    ],
    "Getafe CF": [
        "Escudo",
        "Carta de Estadio - Coliseum", // Bis
        "David Soria", "Letáček", "Iglesias", "Kiko Femenía", "Djene", "Domingos Duarte", "Abqar", "Diego Rico", "Davinchi", "Mario Martín", "Arambarri", "Milla", "Neyou", "Javi Muñoz", "Borja Mayoral", "Liso", "Coba"
    ],
    "Girona FC": [
        "Escudo",
        "Carta de Estadio - Montilivi", // Bis
        "Gazzaniga", "Livakovic", "Arnau", "Hugo Rincón", "Vitor Reis", "Blind", "Francés", "Álex Moreno", "Witsel", "Ounahi", "Iván Martín", "Yáser Asprilla", "Joel Roca", "Tsygankov", "Vanat", "Stuani", "Bryan Gil"
    ],
    "Levante UD": [
        "Escudo",
        "Carta de Estadio - Ciutat de València", // Bis
        "Ryan", "Pablo Campos", "Toljan", "Dela", "Elgezabal", "Matías Moreno", "Manu Sánchez", "Pampín", "Oriol Rey", "Pablo Martínez", "Olasagasti", "Vencedor", "Carlos Álvarez", "Morales", "Brugué", "Iván Romero", "Etta Eyong"
    ],
    "Real Madrid": [
        "Escudo",
        "Carta de Estadio - Santiago Bernabéu", // Bis
        "Courtois", "Lunin", "Carvajal", "Trent", "Militão", "Huijsen", "Rüdiger", "Carreras", "Tchouaméni", "Fede Valverde", "Bellingham", "Guler", "Mastantuono", "Rodrygo", "Mbappé", "Gonzalo", "Vinicius"
    ],
    "RCD Mallorca": [
        "Escudo",
        "Carta de Estadio - Mallorca Son Moix", // Bis
        "Leo Román", "Bergström", "Morey", "Maffeo", "Valjent", "Raillo", "Kumbulla", "Mojica", "Samu Costa", "Antonio Sánchez", "Darder", "Morlanes", "Pablo Torre", "Asano", "Muriqi", "Mateo Joseph", "Jan Virgili"
    ],
    "CA Osasuna": [
        "Escudo",
        "Carta de Estadio - El Sadar", // Bis
        "Sergio Herrera", "Aitor Fernández", "Rosier", "Boyomo", "Catena", "Herrando", "Juan Cruz", "Abel Bretones", "Torró", "Moncayola", "Moi Gómez", "Rubén García", "Aimar Oroz", "Víctor Muñoz", "Raúl García", "Budimir", "Becker"
    ],
    "Real Oviedo": [
        "Escudo",
        "Carta de Estadio - Carlos Tartiere", // Bis
        "Aarón Escandell", "Moldovan", "Nacho Vidal", "Eric Bailly", "David Carmo", "Dani Calvo", "Rahim Alhassane", "Colombatto", "Reina", "Dendoncker", "Cazorla", "Ilić", "Hassan", "Brekalo", "Ilyas Chaira", "Fede Viñas", "Rondón"
    ],
    "Rayo Vallecano": [
        "Escudo",
        "Carta de Estadio - Vallecas", // Bis
        "Batalla", "Cárdenas", "Ratiu", "Balliu", "Lejeune", "Luiz Felipe", "Pep Chavarría", "Pathé Ciss", "Unai López", "Óscar Valentín", "Isi", "Pedro Díaz", "Álvaro García", "Fran Pérez", "Camello", "De Frutos", "Alemão"
    ],
    "Real Sociedad": [
        "Escudo",
        "Carta de Estadio - Anoeta", // Bis
        "Remiro", "Marrero", "Aramburu", "Aritz Elustondo", "Zubeldia", "Caleta-Car", "Sergio Gómez", "Gorrotxategi", "Turrientes", "Pablo Marín", "Carlos Soler", "Brais Méndez", "Kubo", "Barrenetxea", "Oyarzabal", "Óskarsson", "Guedes"
    ],
    "Sevilla FC": [
        "Escudo",
        "Carta de Estadio - Ramón Sánchez-Pizjuán", // Bis
        "Vlachodimos", "Nyland", "Carmona", "Juanlu", "Azpilicueta", "Kike Salas", "Marcão", "Suazo", "Gudelj", "Agoumé", "Sow", "Badé", "Vargas", "Ejuke", "Isaac Romero", "Akor Adams", "Alexis Sánchez"
    ],
    "Valencia CF": [
        "Escudo",
        "Carta de Estadio - Mestalla", // Bis
        "Agirrezabala", "Dimitrievski", "Foulquier", "Correa", "Tárrega", "Copete", "Diakhaby", "Gayá", "Pepelu", "Santamatía", "Javi Guerra", "André Almeida", "Luis Rioja", "Diego López", "Ramazani", "Danjuma", "Hugo Duro"
    ],
    "Villarreal CF": [
        "Escudo",
        "Carta de Estadio - Estadio de la Cerámica", // Bis
        "Luiz Junior", "Arnau tenas", "Mouriño", "Foyth", "Rafa Marín", "Reanato Veiga", "Sergi Cardona", "Santi Comesaña", "Pape Gueye", "Parejo", "Thomas", "Moleiro", "Buchanan", "Mikautadze", "Pépé", "Oluwaseyi", "Ayoze"
    ]
};

const SPECIALS_DATA = [
    // ¡Vamos! (361-380)
    {
        start: 361, category: "vamos", rarity: "¡Vamos!", names: [
            "Deportivo Alavés",
            "Athletic Club",
            "Atlético de Madrid",
            "FC Barcelona",
            "Real Betis",
            "RC Celta",
            "Elche CF",
            "RCD Espanyol",
            "Getafe CF",
            "Girona FC",
            "Levante UD",
            "Real Madrid",
            "RCD Mallorca",
            "CA Osasuna",
            "Real Oviedo",
            "Rayo Vallecano",
            "Real Sociedad",
            "Sevilla FC",
            "Valencia CF",
            "Villarreal CF"
        ]
    }, // 20 Cards

    // Guantes de Oro (381-387)
    {
        start: 381, category: "guantes_oro", rarity: "Guante de Oro", names: [
            "Sivera", "Joan garcía", "David Soria", "Sergio Herrera", "Batalla", "Remiro", "Agirrezabala"
        ]
    },

    // Kriptonita (388-396)
    {
        start: 388, category: "kryptonita", rarity: "Kriptonita", names: [
            "Laporte", "Vivian", "Le Normand", "Affengruber", "Cabrera", "Militão", "Lejeune", "Tárrega", "Mouriño"
        ]
    },

    // Diamante (397-414)
    {
        start: 397, category: "diamante", rarity: "Diamante", names: [
            "Rego", "Dro", "Valentín Gómez", "Pablo García", "Rodri Mendoza", "Riedel", "Davinchi", "Liso", "Vitor Reis", "Joel Roca", "Carlos Álvarez", "Etta Eyong", "Fran González", "Gonzalo", "Han Virgili", "Mateo Joseph", "Víctor Muñoz", "Renato Veiga"
        ]
    },

    // Influencers (415-423)
    {
        start: 415, category: "influencer", rarity: "Influencer", names: [
            "Barrios", "Sotelo", "Febas", "Edu Exposito", "Milla", "Darder", "Aiamar Oroz", "Cazorla", "Unai López"
        ]
    },

    // Protas (424-441)
    {
        start: 424, category: "prota", rarity: "Prota", names: [
            "Tenaglia", "Carlos Vicente", "Eric García", "Cucho Hernández", "Borja Iglesias", "Dolan", "Vanat", "Manu Sanchez", "Tchouaméni", "Leo Román", "Aarón Escandell", "Hassan", "Carlos Soler", "Gorrotxategi", "Batista Mendy", "Alexis Sánchez", "Danjuma", "Buchanan"
        ]
    },

    // Super Crack (442-467)
    {
        start: 442, category: "supercrack", rarity: "Super Crack", names: [
            "Unai simón", "Jauregizar", "Oblak", "Marcos Llorenre", "Álex Baena", "Almada", "Griezmann", "Koundé", "Balde", "Raphinha", "Lewandowski", "Rashford", "Isco", "Lo Celso", "Antony", "Courtois", "Carreras", "Fede Valverde", "Mastantuono", "Budimir", "Isi", "Kubo", "Vargas", "Javi Guerra", "Moleiro", "Pépé"
        ]
    },

    // Card Champions (468) matches User input '466' label but consecutive index would be 468?
    // User says: 466-. FC Barcelona - Card Champions.
    // Wait, Super Cracks ends at Pépé. Start 442. Count specific names:
    // 26 names in my Super Crack list. 442+26 = 468. So next is 468.
    // User list has number typos, assuming consecutive.
    { start: 468, category: "champions", rarity: "Card Champions", names: ["Card Champions"] },

    // Balón de Oro (469-474)
    {
        start: 469, category: "balon_oro", rarity: "Balón de Oro", names: [
            "Nico Williams", "Julián Álvarez", "Pedri", "Lamime Yamal", "Vinicius", "Mbappé"
        ]
    },

    // Balón de Oro Excellence (475)
    { start: 475, category: "balon_oro_excellence", rarity: "Balón de Oro Excellence", names: ["Carvajal"] },

    // Card Atómica (476)
    { start: 476, category: "atomica", rarity: "Card Atómica", names: ["Card Atómica"] },

    // Card Invencible (477)
    { start: 477, category: "invencible", rarity: "Card Invencible", names: ["Card Invencible"] },

    // Campeón Card (478) // Description empty in user text, assuming generic or unknown
    { start: 478, category: "campeon", rarity: "Campeón Card", names: ["Campeón Card"] }
];

// --- IMAGE MAPPINGS ---

const TEAM_SHIELDS = {
    "Deportivo Alavés": "axl26-1.png",
    "Athletic Club": "axl26-19.webp",
    "Atlético de Madrid": "atletico de madrid.png",
    "FC Barcelona": "barcelona.png",
    "Real Betis": "betis.png",
    "RC Celta": "RC_Celta_de_Vigo_logo.svg.png",
    "Elche CF": "elche.png",
    "RCD Espanyol": "espanyol.png",
    "Getafe CF": "getafe.png",
    "Girona FC": "girona.png",
    "Levante UD": "levante.png",
    "Real Madrid": "real madrid.png",
    "RCD Mallorca": "mallorca.png",
    "CA Osasuna": "osasuna.png",
    "Real Oviedo": "Real_Oviedo_logo.svg.png",
    "Rayo Vallecano": "rayo vallecano.png",
    "Real Sociedad": "real sociedad.png",
    "Sevilla FC": "sevilla.png",
    "Valencia CF": "Valenciacf.svg.png",
    "Villarreal CF": "villareal.png"
};

const TEAM_FOLDERS = {
    "Deportivo Alavés": "alaves",
    "Athletic Club": "bilbao",
    "Atlético de Madrid": "atletico_de_madrid",
    "FC Barcelona": "barcelona",
    "Real Betis": "betis",
    "RC Celta": "celta",
    "Elche CF": "elche",
    "RCD Espanyol": "espanyol",
    "Getafe CF": "getafe",
    "Girona FC": "girona",
    "Levante UD": "levante",
    "Real Madrid": "real_madrid",
    "RCD Mallorca": "mallorca",
    "CA Osasuna": "osasuna",
    "Real Oviedo": "oviedo",
    "Rayo Vallecano": "rayo_vallecano",
    "Real Sociedad": "real_sociedad",
    "Sevilla FC": "sevilla",
    "Valencia CF": "valencia",
    "Villarreal CF": "villarreal"
};

const SPECIAL_FOLDERS_MAP = {
    "vamos": "VAMOS",
    "guantes_oro": "GUANTES_DE_ORO",
    "kryptonita": "KRYPTONITA",
    "diamante": "DIAMANTES",
    "influencer": "INFLUENCERS",
    "prota": "PROTAS",
    "supercrack": "SUPER_CRACKS",
    "champions": "CARD_CHAMPIONS",
    "balon_oro": "BALON_DE_ORO",
    "balon_oro_excellence": "BALON_DE_ORO", // Same folder
    "atomica": "CARD_ATOMICA",
    "invencible": "CARD_INVENCIBLE",
    "campeon": "CAMPEON_CARD",
    "new_master": "NEWMASTERS",
    "secreta": "NO_LISTADOS_ESPECIALES_OCULTOS"
};

const SPECIAL_IMAGES = {
    "vamos": "VAMOS!.webp",
    "guantes_oro": "adrenalyn-laliga-2025-2026-guantes-de-oro.webp",
    "kryptonita": "adrenalyn-laliga-2025-2026-kriptonita.webp",
    "diamante": "adrenalyn-laliga-2025-2026-diamante.webp",
    "influencer": "adrenalyn-laliga-2025-2026-influencers.webp",
    "prota": "adrenalyn-laliga-2025-2026-protas.webp",
    "supercrack": "adrenalyn-laliga-2025-2026-super-crack.webp",
    "champions": "card champions.jpg",
    "balon_oro": "balon de oro.jpg",
    "balon_oro_excellence": "carvajal balon de oro excellence.png",
    "atomica": "card atomica.png",
    "invencible": "card invencible.png",
    "campeon": "campeon card.webp",
    "new_master": "adrenalyn-laliga-2025-2026-new-master.png", // For extras
    "secreta": "assets/img/cards/placeholder_special.jpg" // Fallback
};

const STADIUM_CARD_IMAGE = "adrenalyn-laliga-2025-2026-stadium-card.webp";


// --- GENERATION LOGIC ---

const CARDS = [];
let globalIndex = 0; // Will match 'number' mostly, but we use explicit loop counters for 'number'

// 1. Generate Teams (1-360)
// 20 Teams * 18 cards each = 360 cards.

let currentCardNum = 1;

const teamsList = Object.keys(TEAMS_DATA);
teamsList.forEach(team => {
    const items = TEAMS_DATA[team];
    // Expected items: [Escudo, Bis, P2, P3, ..., P18] -> Total 19 items ideally

    const folder = TEAM_FOLDERS[team];

    // 1. Escudo (Always first item)
    const escudoName = items[0];

    // Default Shield Image (Card Visual)
    // Try to find it in the team folder first: assets/img/{folder}/axl26-{id}.webp
    // If not found (conceptually), we might fall back, but here we construct the path.
    let shieldImg = `assets/img/cards/placeholder_${currentCardNum}.jpg`;

    if (folder) {
        shieldImg = `assets/img/${folder}/axl26-${currentCardNum}.webp`;
    }

    // Always resolve the correct Logo/Shield for the team selection grid
    const teamLogoImg = TEAM_SHIELDS[team] ? `assets/img/escudos/${TEAM_SHIELDS[team]}` : `assets/img/cards/placeholder_shield.jpg`;

    CARDS.push({
        id: `axl26-${currentCardNum}`,
        number: currentCardNum.toString(),
        name: escudoName,
        team: team,
        team_logo: teamLogoImg, // Clean Logo for Grid
        category: "base",
        rarity: "Escudo",
        image: shieldImg // Card Image (Photo)
    });

    // 2. Bis (Second item)
    const bisName = items[1];

    // Check for detection
    const isStadium = bisName && (bisName.includes("Stadium") || bisName.includes("Bis") || bisName.includes("Carta de Estadio") || bisName.includes("Estadio"));

    if (isStadium) {
        let bisImg = `assets/img/cards/${STADIUM_CARD_IMAGE}`;
        if (folder) {
            // Revert: Bis is {id}b
            bisImg = `assets/img/${folder}/axl26-${currentCardNum}b.webp`;
        }

        CARDS.push({
            id: `axl26-${currentCardNum}b`, // e.g. 1b
            number: `${currentCardNum} Bis`,
            name: bisName,
            team: team,
            team_logo: teamLogoImg,
            category: "base",
            rarity: "Carta de Estadio", // Force rarity
            image: bisImg
        });
    }

    // 3. Players (Rest of the items)
    // Indexes 2 to end.
    // Files: 1..18.
    // Player 1 (index 2) -> File 2.
    // currentCardNum + (2-1) = 1+1 = 2.

    for (let i = 2; i < items.length; i++) {
        const playerNum = currentCardNum + (i - 1); // logic for ID/Number

        // Default Placeholder
        let playerImg = `assets/img/cards/placeholder_${playerNum}.jpg`;
        if (folder) {
            // Use same number as ID
            playerImg = `assets/img/${folder}/axl26-${playerNum}.webp`;
        }

        CARDS.push({
            id: `axl26-${playerNum}`,
            number: playerNum.toString(),
            name: items[i],
            team: team,
            team_logo: teamLogoImg,
            category: "base",
            rarity: "Base",
            image: playerImg
        });
    }

    // Increment start for next team
    // 18 cards per team (items.length is 19, but they span 18 numbers).
    currentCardNum += 18;
});

// 2. Generate Specials
SPECIALS_DATA.forEach(group => {
    const folder = SPECIAL_FOLDERS_MAP[group.category];

    group.names.forEach((name, idx) => {
        const num = group.start + idx;
        // Image: assets/img/{folder}/axl26-{num}.webp
        // Fallback or explicit check if folder valid
        let specialImg = `assets/img/cards/placeholder_special.jpg`;

        if (folder) {
            specialImg = `assets/img/${folder}/axl26-${num}.webp`;
        }

        CARDS.push({
            id: `axl26-${num}`,
            number: num.toString(),
            name: name,
            team: "Especial",
            category: group.category,
            rarity: group.rarity,
            image: specialImg
        });
    });
});

// 3. Fuera de Colección / Extra cards
// IDs can follow main sequence or be custom.
// User list:
// New Master (NW/1 ... NW/15)
// Momentum, etc.

const EXTRAS = [
    {
        prefix: "NW", category: "new_master", rarity: "New Master", names: [
            "Vlachodimos", "Radu", "Trent", "Caleta-Car", "Hancko", "Suazo", "Nico González", "Santamaría", "Amrabat", "Mastantuono", "Almada", "Dolan", "Mikautadze", "Rashford", "Oluwaseyi"
        ]
    },
    {
        prefix: "S", category: "secreta", rarity: "Secreta", names: [
            "Autógrafo Prestige - Secret", "Edición Limitada - 1", "Edición Limitada - 2", "Edición Limitada - 3",
            "Extra Gold - 1", "Extra Gold - 2",
            "Momentum - 1", "Momentum - 2", "Míticos Invencibles Oro", "Momentum - 3", "Míticos Invencibles Oro Puro",
            "Momentum - 4", "Maxi Momentum El Clásico", "Momentum - 5"
        ]
    }
];

EXTRAS.forEach(group => {
    const folder = SPECIAL_FOLDERS_MAP[group.category];

    group.names.forEach((name, idx) => {
        const num = idx + 1;
        const id = `${group.prefix}/${num}`;

        let extraImg = `assets/img/cards/placeholder_extra.jpg`;
        // Fix for New Master vs Secreta filenames
        if (folder) {
            if (group.category === "new_master") {
                // New Masters are just axl26-1.webp, axl26-2.webp in their folder
                extraImg = `assets/img/${folder}/axl26-${num}.webp`;
            } else {
                // Secreta uses S-1, etc.
                extraImg = `assets/img/${folder}/axl26-${group.prefix}-${num}.webp`;
            }
        }

        // Logo...
        let groupLogo = "assets/img/cards/placeholder_shield.jpg";
        if (group.category === "secreta") {
            groupLogo = "assets/img/secret_question_mark_logo.png";
        } else if (group.category === "new_master") {
            groupLogo = "assets/img/cards/placeholder_shield.jpg";
        }

        CARDS.push({
            id: `axl26-${group.prefix}-${num}`,
            number: id,
            name: name,
            team: "Extra",
            team_logo: groupLogo,
            category: group.category,
            rarity: group.rarity,
            image: extraImg
        });
    });
});


const outputPath = path.join(__dirname, 'adrenalyn-25-26.js');
const fileContent = `window.CARDS_DATA = ${JSON.stringify(CARDS, null, 2)};`;
fs.writeFileSync(outputPath, fileContent);

console.log(`Generated ${CARDS.length} cards database at ${outputPath}`);
