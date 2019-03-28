import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { database, auth } from "../firebase";
import "./dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.gameroomsRef = database.ref("/gamerooms");
    this.inGameUsers = database.ref("/ingameusers");
    this.state = {
      user: this.props.user
    };
  }

  createGameRoom = () => {
    const { user } = this.props;
    // set host info
    let host = {};
    host[user.uid] = {
      email: user.email,
      displayName: user.displayName
    };
    console.log(host);
    // push host info and create new game room in db
    const gid = this.gameroomsRef.push({
      players: host,
      status: "open",
      host: user.uid
    }).key;

    console.log(user.uid);
    // set host as in game user
    this.inGameUsers
      .child(user.uid)
      .set({ gid: gid, user: user.displayName })
      .then(() => {
        // redirect to create page
        this.props.history.push(`/gameroom/${gid}?uid=${user.uid}`);
      });
  };

  handleLogOut = () => {
    auth.signOut().then(() => {
      this.setState({
        user: {
          email: "",
          displayName: "",
          uid: ""
        }
      });
    });
  };

  render() {
    const { user } = this.state;
    console.log(user.email, user.displayName, user.uid);
    return (
      <div>
        welcome,
        {user.displayName} ,{" "}
        <a href="#" onClick={this.handleLogOut}>
          logout
        </a>
        <div className="row">
          <button onClick={this.createGameRoom} className="btn btn-primary">
            Create new game
          </button>
          <Link
            to={{
              pathname: "/join",
              state: {
                user: {
                  email: user.email,
                  uid: user.uid,
                  displayName: user.displayName
                }
              }
            }}
          >
            <button className="btn btn-primary">Join game</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
