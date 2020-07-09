import PropTypes from "prop-types";

const React = require("react");
const netlifyIdentity = require("netlify-identity-widget");

export const IdentityContext = React.createContext({});
const IdentityProvider = ({ children }) => {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    netlifyIdentity.init({});
  });
  netlifyIdentity.on("login", (loggedInUser) => {
    netlifyIdentity.close();
    setUser(loggedInUser);
  });
  netlifyIdentity.on("logout", () => {
    netlifyIdentity.close();
    setUser(null);
  });

  return (
    <IdentityContext.Provider value={{ identity: netlifyIdentity, user }}>
      {children}
    </IdentityContext.Provider>
  );
};

export const Provider = IdentityProvider;

IdentityProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
