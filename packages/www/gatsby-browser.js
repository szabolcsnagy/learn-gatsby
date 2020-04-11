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

// create apollo client to fetch data from graphQL endpoint.
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://learn-gatsby-gh.netlify.com/.netlify/functions/graphql",
  }),
});

exports.wrapRootElement = ({ element }) => {
  // To allow access to the graphQL through 'useQuery' and 'useMutation' from any component.
  return (
    <ApolloProvider client={client}>{rootElement({ element })}</ApolloProvider>
  );
};
