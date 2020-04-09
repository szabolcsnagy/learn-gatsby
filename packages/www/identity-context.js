// must use common js import so node can run it.
const React = require("react");
const netlifyIdentity = require("netlify-identity-widget");
const IdentityContext = React.createContext({});

// must export the actual React context
exports.IdentityContext = IdentityContext;

// common logic to get the user in every component
const IdentityProvider = (props) => {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    netlifyIdentity.init({});

    netlifyIdentity.on("login", (user) => {
      // to make sure click events are not trapped by netlifyIdentity
      netlifyIdentity.close();
      setUser(user);
    });

    netlifyIdentity.on("logout", () => {
      // to make sure click events are not trapped by netlifyIdentity
      netlifyIdentity.close();
      setUser();
    });

    // setting the initial value of the user
    // if we logged in this will set the current user
    const user = netlifyIdentity.currentUser();
    setUser(user);
  }, []); // run it only once

  return (
    <IdentityContext.Provider value={{ identity: netlifyIdentity, user }}>
      {props.children}
    </IdentityContext.Provider>
  );
};

exports.Provider = IdentityProvider;
