import React, { Component } from "react";
import { database } from "../firebase";

export default class history extends Component {
  state = {
    pastGames: []
  };
  async componentDidMount() {
    let pastGames = database.ref("gamerooms");

    pastGames.on(
      "value",
      snapshot => {
        let data = snapshot.val();
        console.log(data);
        let filterGames = Object.keys(data).filter(game => {
          return data[game].status !== "cancelled";
        });

        this.setState({
          pastGames: filterGames
        });
      },
      error => {
        console.log("Error: " + error.code);
      }
    );
  }
  renderPastGames() {
    if (this.state.pastGames) {
      return this.state.pastGames.map(gid => {
        return (
          <a href={"/history/" + gid} key={gid} style={{ display: "block" }}>
            {gid}
          </a>
        );
      });
    }
  }
  render() {
    return <div>{this.renderPastGames()}</div>;
  }
}
