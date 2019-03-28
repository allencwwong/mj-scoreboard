import React, { Component } from "react";
import { database } from "../firebase";

class GamePlayList extends Component {
  constructor() {
    super();
    this.gameroomsRef = database.ref("/gamerooms");
    this.state = {
      isLoaded: false
    };
  }
  componentDidMount() {
    const gid = window.location.pathname.split("/")[2];
    this.gameroomsRef.child(gid).on("value", snapshot => {
      this.setState({
        players: snapshot.val().players,
        isLoaded: true
      });
    });
  }

  render() {
    const { isLoaded } = this.state;
    if (isLoaded) {
      const { players } = this.state;
      let playersKeys = Object.keys(players);
      let renderPlayerList = () => {
        let playerList = [];
        playersKeys.forEach(playerKey => {
          playerList.push(
            <li key={playerKey}>{players[playerKey].displayName} </li>
          );
        });
        return playerList;
      };
      return (
        <div>
          <ul>{renderPlayerList()}</ul>
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}

export default GamePlayList;
