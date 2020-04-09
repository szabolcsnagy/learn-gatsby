import React from "react";
import { Router } from "@reach/router";
import { IdentityContext } from "../../identity-context";
import Menu from "../components/Menu.jsx";
import { Heading, Button, Flex, Container } from "theme-ui";

const DashLoggedOut = () => {
  // deconstruct the user from the provider
  const { identity } = React.useContext(IdentityContext);
  return (
    <Flex sx={{ flexDirection: "column", padding: 3 }}>
      <Heading as="h1">Get Stuff Done</Heading>
      <Button
        sx={{ marginTop: 2 }}
        onClick={() => {
          identity.open();
        }}
      >
        Log In
      </Button>
    </Flex>
  );
};

const Dash = () => {
  // deconstruct the user from the provider
  const { user } = React.useContext(IdentityContext);

  return <div>Dash hasUser: {user && user.user_metadata.full_name}</div>;
};

export default (props) => {
  const { user } = React.useContext(IdentityContext);
  return (
    <Container>
      <Menu />
      <Router>
        {user ? <Dash path="/app" /> : <DashLoggedOut path="/app" />}
      </Router>
    </Container>
  );
};
