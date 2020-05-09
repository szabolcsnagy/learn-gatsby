const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const q = faunadb.query;

let client = new faunadb.Client({ secret: process.env.FAUNA });

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

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    todos: async (parent, args, context) => {
      if (!context.user) {
        // no logged in user
        return [];
      }
      const result = await client.query(
        q.Paginate(q.Match(q.Index("todos_by_user"), context.user))
      );
      // turn the arrays of array returned from FAUNA
      // into an array of objects for graphQL
      return result.data.map(([ref, done, text]) => ({
        id: ref.id,
        text,
        done,
      }));
    },
  },
  Mutation: {
    // The first argument is the parent object
    addTodo: async (_, { text }, context) => {
      if (!context.user) {
        throw new Error("Must be authenticated to insert todos.");
      }

      const result = await client.query(
        q.Create(q.Collection("todos"), {
          data: {
            text,
            done: false,
            owner: context.user,
          },
        })
      );
      return {
        ...result.data,
        id: result.ref.id,
      };
    },

    updateTodoDone: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error("Must be authenticated to insert todos");
      }

      const result = await client.query(
        q.Update(q.Ref(q.Collection("todos"), id), {
          data: {
            done: true,
          },
        })
      );
      return {
        ...result.data,
        id: result.ref.id,
      };
    },
  },
};

// create a new server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // make sure the server only serve the user
  // this request belongs to.
  // Take the request.context
  context: ({ context }) => {
    if (context.clientContext.user) {
      // returns the context object that will be passed
      // to the resolver as the 3rd argument
      return { user: context.clientContext.user.sub };
    } else {
      return {};
    }
  },

  // By default GraphQL playground and introspection are
  // disabled and they need to be explicitly enabled here.
  // This should be off in production.
  playground: false,
  introspection: false,
});

exports.handler = server.createHandler({
  // to allow api access from localhost
  cors: { origin: "http://localhost:8000", credentials: true },
});
