import React, { Component } from "react";
import { database } from "../firebase";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import GamePlayerList from "../components/GamePlayerList";
import GamePreStart from "../components/GamePreStart";
import GameScoreBoard from "../components/GameScoreBoard";

class Gameroom extends Component {
  constructor() {
    super();
    this.state = {
      gid: null,
      players: null,
      status: null,
      uid: null,
      host: null,
      started: false
    };
    this.gameroomsRef = database.ref("/gamerooms");
    this.ingameUsers = database.ref("/ingameusers");
  }

  handleStartGameRoomClick = () => {
    // check for enough players
    // change status to started
  };

  componentDidMount() {
    let params = queryString.parse(this.props.location.search);
    console.log(params);
    const gid = window.location.pathname.split("/")[2];

    this.gameroomsRef.child(gid).on("value", snapshot => {
      // set states for game room
      let snapVar = snapshot.val(),
        isStarted = false,
        status = snapVar.status || null,
        players = snapVar.players || null,
        host = snapVar.host || null;

      if (players) {
        if (snapVar.status === "started") {
          console.log(snapVar.status);
          console.log(params.uid);
          this.setState({
            status: "started",
            started: true,
            gid: gid,
            uid: params.uid
          });
        } else if (snapVar.status === "cancelled") {
          // check gameroom players remove all from ingame
          let playerIds = Object.keys(snapshot.val().players);
          playerIds.forEach(id => {
            this.ingameUsers.child(id).remove();
            this.gameroomsRef.child(`${gid}/players`).remove();
          });
        } else if (snapVar.status === "open") {
          this.setState({
            gid: gid,
            params: params,
            status: status,
            players: players,
            uid: params.uid,
            started: isStarted,
            host: host
          });
        }
      } else {
        this.setState({
          status: "cancelled",
          players: null,
          started: false,
          host: null
        });
      }
    });
  }

  render() {
    const { players, status, uid, gid, host } = this.state;
    if (status === "cancelled") {
      this.props.history.push(`/?uid=${uid}`);
      return <div>exit room</div>;
    } else if (status === "open" && players) {
      alert("open");
      return (
        <div>
          <h1>Game Room#{gid}</h1>
          <h2>Players in room:</h2>
          {status ? <GamePlayerList players={players} /> : "creating game room"}
          {status ? <GamePreStart gid={gid} uid={uid} host={host} /> : ""}
        </div>
      );
    } else if (status === "started") {
      return (
        <div>
          <h1>Game Room#{gid}</h1>
          <GameScoreBoard uid={uid} gid={gid} />
        </div>
      );
    } else {
      return <div>loading gameroom</div>;
    }
  }
}

export default withRouter(Gameroom);
