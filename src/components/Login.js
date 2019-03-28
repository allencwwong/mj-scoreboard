import React from "react";
import { auth, googleAuthProvider } from "../firebase";

class Login extends React.Component {
  render() {
    return (
      <div>
        <button onClick={() => auth.signInWithPopup(googleAuthProvider)}>
          Sign in with google
        </button>
      </div>
    );
  }
}

export default Login;
