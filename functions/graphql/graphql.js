const { ApolloServer, gql } = require("apollo-server-lambda");

// Construct a schema, using graphQL schema language
const typeDefs = gql`
  type Query {
    todos: [Todo]! # the array is required
  }
  type Todo {
    id: ID!
    text: String!
    done: Boolean!
  }
  type Mutation {
    addTodo(text: String!): Todo
    updateTodoDone(id: ID!): Todo
  }
`;

// in memory storage of todos
const todos = {};
let todoIndex = 0;
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    todos: () => {
      return Object.values(todos);
    },
  },
  Mutation: {
    // The first argument is the parent object
    addTodo: (_, { text }) => {
      // todoIndex++;
      const id = `key-${Math.random()}`;
      todos[id] = { id, text, done: false };
      return todos[id];
    },
    updateTodoDone: (_, { id }) => {
      const todoToUpdate = todos[id];
      if (todoToUpdate) {
        todoToUpdate.done = !todoToUpdate.done;
      }
      return todos[id]; // return undefined if not exists; that is fine a Todo is nullable
    },
  },
};

// create a new server
const server = new ApolloServer({
  typeDefs,
  resolvers,

  // By default GraphQL playground and introspection are
  // disabled and they need to be explicitly enabled here.
  // This should be off in production.
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler({
  // to allow api access from localhost
  cors: { origin: "http://localhost:8000", credentials: true },
});
