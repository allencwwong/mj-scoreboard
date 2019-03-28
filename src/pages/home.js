import React from "react";
import Login from "../components/Login";
import { auth } from "../firebase";
import Dashboard from "./dashboard";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(currentUser => {
      console.log(currentUser);
      this.setState({ currentUser });
    });
  }

  render() {
    const { currentUser } = this.state;
    return (
      <div>
        <h1>Home page</h1>
        {!currentUser && <Login />}
        {currentUser && <Dashboard user={currentUser} />}
      </div>
    );
  }
}

export default Home;
