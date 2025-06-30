import {Character, House} from "./types.ts";

const HP_API_BASE = "https://hp-api.onrender.com/api";
const HOUSES = ["gryffindor", "slytherin", "hufflepuff", "ravenclaw"];

async function fetchFromAPI(endpoint: string): Promise<Character[] | null> {
    try{
        const response = await fetch(`${HP_API_BASE}${endpoint}`);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status} `);
        }
        return await response.json() as Character[];
    }catch(error){
        console.error(`Error fetching from API: ${endpoint}`, error);
        return null;
    }
}
async function transformHPCharacters(hpChar: Character): Character {
    return {
        id: hpChar.id,
        name: hpChar.name,
        alternate_names: hpChar.alternate_names,
        species: hpChar.species,
        gender: hpChar.gender,
        house: null,
    };
}
async function getAllCharacters(): Promise<Character[]> {
    const hpCharacters = await fetchFromAPI("/characters");
    if(!hpCharacters) return [];

    return hpCharacters.map(transformHPCharacters);
}

export async function getCharacter(id: string): Promise<Character | null> {
    const allcharacters = await getAllCharacters();
    return allcharacters.find(char => char.id === id) ||null;
}

export async function getCharacters(ids?: string[]): Promise<Character[]> {
    const allcharacters = await getAllCharacters();
    if(!ids || ids.length === 0){
        return allcharacters;
    }
    return allcharacters.filter(char => ids.includes(char.id));
}