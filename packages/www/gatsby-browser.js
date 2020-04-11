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

const authLink = setContext((_, { headers }) => {
  // take the Bearer token from the netlify user
  const user = netlifyIdentity.currentUser();
  const token = user.token.access_token;
  // and add it to the headers
  return {
    headers: {
      ...headers, // keep the previous headers
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = new HttpLink({
  uri: "https://learn-gatsby-gh.netlify.com/.netlify/functions/graphql",
});

// create apollo client to fetch data from graphQL endpoint.
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

exports.wrapRootElement = ({ element }) => {
  // To allow access to the graphQL through 'useQuery' and 'useMutation' from any component.
  return (
    <ApolloProvider client={client}>{rootElement({ element })}</ApolloProvider>
  );
};
