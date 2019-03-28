import React, { Component } from "react";
import { database } from "../firebase";
import { withRouter } from "react-router-dom";

class GamePreStart extends Component {
  constructor(props) {
    super(props);
    this.State = {
      gid: null,
      uid: null,
      host: null
    };
    this.gameroomsRef = database.ref("/gamerooms");
    this.ingameUsers = database.ref("/ingameusers");
  }

  handleRemoveGameRoomClick = () => {
    let { gid, uid, host } = this.props;

    console.log("run remove game function");
    // cancel game when host cancel
    if (host === uid) {
      let statusPath = `${gid}/status`;
      // set gameroom stat cancelled
      this.gameroomsRef.child(statusPath).set("cancelled");
    }
    // remove player from game room
    this.gameroomsRef.child(`${gid}/players/${uid}`).remove();
    // remove from ingameuser
    this.ingameUsers.child(uid).remove();
    // redirect to home
    this.props.history.push(`/?uid=${uid}`);
  };

  handleStartGameClick = () =>{
      //change status to started
      this.gameroomsRef.child(`${this.props.gid}/status`).set('started');
  }

  render() {
    if (this.props.gid) {
      return (
        <div className="row">
          <div className="col-lg-6">
            <button onClick={()=> this.handleStartGameClick()} className="col-lg-10">Start</button>
          </div>
          <div className="col-lg-6">
            <button
              onClick={() => this.handleRemoveGameRoomClick()}
              className="col-lg-10"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    } else {
      return <div>loading...</div>;
    }
  }
}

export default withRouter(GamePreStart);
