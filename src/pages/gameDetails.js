import React, { Component } from "react";
import { database } from "../firebase";
export default class gameDetails extends Component {
  state = {
    playerScores: []
  };

  componentDidMount() {
    let gid = this.props.match.params.gid;
    // console.log(gid);
    let game = database.ref("gamerooms").child(gid);
    game.on(
      "value",
      snapshot => {
        let data = snapshot.val();
        // console.log(data.scoreboard);
        // console.log(data.players);

        let playerScores = Object.keys(data.scoreboard)
          .map(player => {
            // console.log(player);
            // console.log(data.players[player]);
            let playerInfo = data.players[player];
            let scores = Object.keys(data.scoreboard[player]).map(round => {
              console.log(data.scoreboard[player][round]);

              let { winType, status, points } = data.scoreboard[player][round];
              let mjScore = 0;

              if (status === "winner") {
                if (winType === "all") {
                  mjScore = Math.pow(2, points + 1) * 3;
                } else {
                  mjScore = Math.pow(2, points + 2);
                }
              }
              if (status === "loser") {
                if (winType === "all") {
                  mjScore = -Math.abs(Math.pow(2, points + 1));
                } else {
                  mjScore = -Math.abs(Math.pow(2, points + 2));
                }
              }
              console.log(mjScore);

              return mjScore;
            });
            let sumScores = scores.reduce((total, curr) => {
              return total + curr;
            });
            // console.log(sumScores);
            return {
              playerInfo: playerInfo,
              score: sumScores
            };
          })
          .sort((a, b) => {
            return b.score > a.score ? 1 : -1;
          });

        console.log(playerScores);
        this.setState({
          gid: gid,
          playerScores: playerScores
        });
      },
      error => {
        console.log("Error: " + error.code);
      }
    );
  }

  renderPlayerScores() {
    let inlineStyles = {
      maxWidth: "100px",
      width: "100%",
      borderRadius: "50%"
    };
    let divStyle = {
      border: "1px solid black",
      margin: "3% 10%",
      padding: "20px"
    };
    return this.state.playerScores.map(player => {
      console.log(player);

      return (
        <div style={divStyle}>
          <img
            src={player.playerInfo.photoURL}
            style={inlineStyles}
            alt={player.playerInfo.displayName}
          />
          <p>{player.playerInfo.displayName}</p>
          <p style={{ marginBottom: 0 }}>{player.score}</p>
        </div>
      );
    });
  }

  render() {
    console.log("render", this.state.playerScores);
    return (
      <div>
        <p>Game: {this.state.gid}</p>
        {this.renderPlayerScores()}
      </div>
    );
  }
}
