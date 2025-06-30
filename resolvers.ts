import { Character, House } from "./types.ts";
import { getCharacter, getCharacters, getCharacterHouse } from "./services.ts";

export const resolvers = {
  Query: {
    getCharacter: async (_: unknown, args: { id: string }): Promise<Character | null> => {
      return await getCharacter(args.id);
    },

    getCharacters: async (_: unknown, args: { ids?: string[] }): Promise<Character[]> => {
      return await getCharacters(args.ids);
    }
  },

  Character: {
    house: async (parent: Character): Promise<House | null> => {
      return await getCharacterHouse(parent);
    }
  },

  House: {
    characters: (parent: House): Character[] => {
      return parent.characters.map(character => ({
        ...character,
        house: parent
      }));
    }
  }
};