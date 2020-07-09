import React, { useContext } from "react";
import Protected from "./Protected";
import "./App.css";
import { Router, Link, navigate } from "@reach/router";
import { IdentityContext } from "./identityContext";

function AuthExample() {
  return (
    <div className="App">
      <Router>
        <Home path="/" />
        <PrivateRoute path="/protected" as={Protected} />
      </Router>
    </div>
  );
}

const Home = () => {
  return (
    <>
      <LoginButton />
      <ul>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>
    </>
  );
};

const LoginButton = () => {
  const { identity: netlifyIdentity, user } = useContext(IdentityContext);

  const login = () => {
    netlifyIdentity.open();
  };
  const logout = () => {
    netlifyIdentity.logout(() => navigate("/"));
  };
  return user ? (
    <div>
      <button onClick={logout}>Sign out</button>
      <p>Welcome! </p>
    </div>
  ) : (
    <div>
      <button onClick={login}>Log in</button>
      <p>You are not logged in.</p>
    </div>
  );
};

const PrivateRoute = (props) => {
  const { user } = useContext(IdentityContext);

  let { as: Comp, ...restOfTheProps } = props;
  return user ? <Comp {...restOfTheProps} /> : <Login />;
};

function Login() {
  return (
    <div>
      Need to be logged in to access this route <Link to={"/"}>Home</Link>
    </div>
  );
}

export default AuthExample;
