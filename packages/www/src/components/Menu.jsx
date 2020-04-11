import React from "react";
import { Flex, NavLink } from "theme-ui";
import { Link } from "@reach/router";
import { IdentityContext } from "../../identity-context";

const Menu = () => {
  const { user, identity } = React.useContext(IdentityContext);

  return (
    <Flex as="nav">
      <NavLink as={Link} to="/" p={2}>
        Home
      </NavLink>
      <NavLink as={Link} to={"/app"} p={2}>
        Dashboard
      </NavLink>
      {/* only if a user logged in  */}
      {user && (
        <NavLink
          href="#!"
          p={2}
          onClick={() => {
            identity.logout();
          }}
        >
          Log out {user.user_metadata.full_name}
        </NavLink>
      )}
    </Flex>
  );
};

export default Menu;
