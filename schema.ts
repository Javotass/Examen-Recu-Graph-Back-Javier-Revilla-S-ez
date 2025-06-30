export const typeDefs = `#graphql
  type Character {
    id: String!
    name: String!
    alternate_names: [String!]!
    species: String!
    gender: String!
    house: House
  }

  type House {
    name: String!
    characters: [Character!]!
  }

  type Query {
    getCharacter(id: String!): Character
    getCharacters(ids: [String!]): [Character!]!
  }
`;