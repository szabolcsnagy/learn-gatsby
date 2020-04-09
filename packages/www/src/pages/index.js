import React from "react";
import { Container, Heading, Button, Flex } from "theme-ui";
import Menu from "../components/Menu";
import { IdentityContext } from "../../identity-context";

export default (props) => {
  const { identity } = React.useContext(IdentityContext);

  return (
    <Container>
      <Menu />
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
    </Container>
  );
};
