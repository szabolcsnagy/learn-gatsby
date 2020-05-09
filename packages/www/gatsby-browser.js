const React = require("react");

const rootElement = require("./wrap-root-element");

// Apollo client uses fetch which not exists in node
// Make sure it is only called from the browser
const {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} = require("@apollo/client");

// setContext will prepare the http headers with the user token
const { setContext } = require("apollo-link-context");
const netlifyIdentity = require("netlify-identity-widget");

const authLink = setContext(async (_, { headers }) => {
  // take the Bearer token from the netlify user
  const user = netlifyIdentity.currentUser();
  const token = user.token.access_token;
  const isTokenValid = () =>
    user && user.token && user.token.expires_at > Date.now();
  if (!isTokenValid()) {
    // console.log("BEFORE refresh", user.token);
    // renew access token; - it updates the user object
    await user.jwt(true); // true - forces a new token
  }

  // and add it to the headers
  return {
    headers: {
      ...headers, // keep the previous headers
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// const { ApolloLink } = require("apollo-link");

// const consoleLink = new ApolloLink((operation, forward) => {
//   const user = netlifyIdentity.currentUser();

//   console.log(
//     `starting request for ${operation.operationName}`

//   );
//   // basically forward is a callback representing the next link in the chain
//   // once the chain ends/terminates the return path is activated on the chain
//   return forward(operation).map((data) => {
//     console.log(`ending request for ${operation.operationName}`);
//     // don't forget to return the data from the previous link
//     return data;
//   });
// });

const httpLink = new HttpLink({
  // uri: "https://learn-gatsby-gh.netlify.com/.netlify/functions/graphql",
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080/"
      : "https://us-east1-classion.cloudfunctions.net/handler",
});

// create apollo client to fetch data from graphQL endpoint.
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink), // chain link objects
});

exports.wrapRootElement = ({ element }) => {
  // To allow access to the graphQL through 'useQuery' and 'useMutation' from any component.
  return (
    <ApolloProvider client={client}>{rootElement({ element })}</ApolloProvider>
  );
};
