import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoClient } from "mongodb";
import { resolvers } from "./resolvers.ts";
import { typeDefs } from "./schema.ts";
import { MuseumModel } from "./types.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) throw new Error("MONGO_URL not defined");

const mongo = new MongoClient(MONGO_URL);
await mongo.connect();

const db = mongo.db("ExamenGraphQL"); //cambialo por nombre que te pida
const Museums = db.collection<MuseumModel>("museos");//cambialo por nombre que te pida

const server = new ApolloServer({ typeDefs, resolvers });//cambialo por nombre que te pida

const { url } = await startStandaloneServer(server, {
  context: async () => ({ Museums }), //cambialo por nombre que te pida
});

console.info(` EL server funciona ${url}`);
