import React, { Component } from "react";
import { database } from "../firebase";
import JoinGameList from "../components/JoinGameList";

class Join extends Component {
  constructor() {
    super();
    this.state = {
      gamerooms: null,
      status: false
    };
    this.gameroomsRef = database.ref("/gamerooms");
  }

  componentDidMount() {
    this.gameroomsRef
      .orderByChild("status")
      .equalTo("open")
      .on("value", snapshot => {
        if (snapshot.val()) {
          this.setState({
            gamerooms: snapshot.val(),
            status: true
          });
        }
      });
  }

  render() {
    const { user } = this.props.location.state;
    // console.log(this.props.location.state);
    console.log(user);
    const { gamerooms, status } = this.state;
    return (
      <div>
        <h1>Join page</h1>
        {status ? (
          <JoinGameList gamerooms={gamerooms} user={user} />
        ) : (
          "looking for rooms"
        )}
      </div>
    );
  }
}

export default Join;
