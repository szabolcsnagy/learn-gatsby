import React from "react";
import { Container, Heading, Button, Flex, NavLink } from "theme-ui";
import { Link } from "@reach/router";
import Menu from "../components/Menu";
import { IdentityContext } from "../../identity-context";

export default (props) => {
  const { identity, isTokenValid } = React.useContext(IdentityContext);
  const tokenValid = isTokenValid();
  return (
    <Container>
      <Menu />
      <Flex sx={{ flexDirection: "column", padding: 3 }}>
        <Heading as="h1">Get Stuff Done</Heading>
        {!tokenValid && (
          <Button
            sx={{ marginTop: 2 }}
            onClick={() => {
              identity.open();
            }}
          >
            Log In
          </Button>
        )}
        {tokenValid && (
          <p>
            Please visit your
            <NavLink as={Link} to={"/app"} p={2}>
              dashboard.
            </NavLink>
          </p>
        )}
      </Flex>
    </Container>
  );
};
