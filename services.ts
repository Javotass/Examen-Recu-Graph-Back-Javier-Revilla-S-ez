import { Character, House } from "./types.ts";
const HP_API_BASE = "https://hp-api.onrender.com/api";
const HOUSES = ["gryffindor", "slytherin", "hufflepuff", "ravenclaw"];

async function fetchFromAPI(endpoint: string): Promise<Character[] | null> {
    try {
        const response = await fetch(`${HP_API_BASE}${endpoint}`); 
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as Character[];
    } catch (error) {
        console.error(`Error fetching from API: ${endpoint}`, error);
        return null;
    }
}
function transformHPCharacter(hpChar: Character): Character {
    return {
        id: hpChar.id,
        name: hpChar.name,
        alternate_names: hpChar.alternate_names || [],
        species: hpChar.species || "Human",
        gender: hpChar.gender || "Unknown",
        house: null
    };
}

async function getAllCharacters(): Promise<Character[]> {
    const hpCharacters = await fetchFromAPI("/characters");
    if (!hpCharacters) return [];
    return hpCharacters.map(transformHPCharacter);
}

export async function getCharacter(id: string): Promise<Character | null> {
    const allCharacters = await getAllCharacters();
    return allCharacters.find(char => char.id === id) || null;
}

export async function getCharacters(ids?: string[]): Promise<Character[]> {
    const allCharacters = await getAllCharacters();
    if (!ids || ids.length === 0) {
        return allCharacters;
    }
    return allCharacters.filter(char => ids.includes(char.id));
}

export async function getHouse(houseName: string): Promise<House | null> {
    const normalizedName = houseName.toLowerCase();
    if (!HOUSES.includes(normalizedName)) {
        return null;
    }

    const hpCharacters = await fetchFromAPI(`/characters/house/${normalizedName}`);
    if (!hpCharacters) return null;

    const characters = hpCharacters.map(transformHPCharacter);
    
    const house: House = {
        name: normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1),
        characters
    };
    return house;
}
export async function getCharacterHouse(character: Character): Promise<House | null> {
    for (const houseName of HOUSES) {
        const house = await getHouse(houseName);
    if (house && house.characters.some(char => char.id === character.id)) {
        return house;
    }
    }
return null;
}