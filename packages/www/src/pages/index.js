import React from "react";
import { Container, Heading, Button, Flex } from "theme-ui";
import netlifyIdentity from "netlify-identity-widget";

export default (props) => {
  // useEffect only runs on the browser and not during gatsby build
  React.useEffect(() => {
    // needs to run on the client side
    netlifyIdentity.init({});
  }, []); // run it once

  return (
    <Container>
      <Flex sx={{ flexDirection: "column", padding: 3 }}>
        <Heading>Get Stuff Done</Heading>
        <Button
          sx={{ marginTop: 2 }}
          onClick={() => {
            netlifyIdentity.open();
          }}
        >
          Log In
        </Button>
      </Flex>
    </Container>
  );
};
