import React, { Component } from "react";
import { database } from "../firebase";
import { withRouter } from "react-router-dom";

class JoinGameList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      inGame: null
    };
    this.gameroomsRef = database.ref("/gamerooms");
    this.ingameUsers = database.ref("/ingameusers");
  }

  handleJoinClick = gid => {
    const { user } = this.props;
    // check user
    if (this.state.inGame) {
      // alert already in a game redirect to game page
      alert("already in game pls leave game to join new");
      // redirect to game room
      this.props.history.push(`/gameroom/${gid}?uid=${user.uid}`);
    } else {
      // let user join game

      const playersPath = `${gid}/players/${user.uid}`;
      this.gameroomsRef
        .child(playersPath)
        .set({ email: user.email, displayName: user.displayName });

      this.ingameUsers
        .child(user.uid)
        .set({ gid: gid, user: user.displayName });

      // redirect to game room
      this.props.history.push(`/gameroom/${gid}?uid=${user.uid}`);
    }
  };

  componentDidMount() {
    const { user } = this.props;

    this.ingameUsers.child(user.uid).on("value", snapshot => {
      if (snapshot.val()) {
        this.setState({
          inGame: true,
          gid: snapshot.val().gid
        });
      } else {
        this.setState({
          inGame: false
        });
      }
    });
  }

  render() {
    const { gamerooms } = this.props;
    let gids = Object.keys(gamerooms);
    console.log("====");
    console.log(gids);
    // let playersKeys = Object.keys(players);
    let renderPlayerList = (playersKeys, players) => {
      let playerList = [];
      playersKeys.forEach(playerKey => {
        playerList.push(players[playerKey].displayName);
      });
      return playerList;
    };
    let gameroomList = () => {
      let gameroomList = [];
      gids.forEach(gid => {
        gameroomList.push(
          <li className="row" key={gid}>
            <div className="col-lg-12">
              {gid} |
              <button
                onClick={() => {
                  this.handleJoinClick(gid);
                }}
                className="btn btn-primary"
              >
                join
              </button>
            </div>
            <div className="col-lg-12">
              {renderPlayerList(
                Object.keys(gamerooms[gid].players),
                gamerooms[gid].players
              )}
            </div>
          </li>
        );
      });
      return gameroomList;
    };
    return (
      <div>
        <ul>{gameroomList()}</ul>
      </div>
    );
  }
}

export default withRouter(JoinGameList);
