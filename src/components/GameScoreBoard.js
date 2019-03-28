import React, { Component } from "react";
import { database } from "../firebase";
import GameAddScore from "./GameAddScore";
import GameScores from "./GameScores";

class GameScoreBoard extends Component {
    constructor(props) {
        super(props);
        this.gameroomsRef = database.ref("/gamerooms");
        this.state = {
            isLoaded: false,
            modalShow: false
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
        let modalClose = () => this.setState({ modalShow: false });

        if (this.state.isLoaded) {
            const { players } = this.state;
            let playersKeys = Object.keys(players);
            let renderPlayerList = () => {
                let playerList = [];
                playersKeys.forEach(playerKey => {
                    playerList.push(
                        <th key={playerKey}>
                            {players[playerKey].displayName}{" "}
                        </th>
                    );
                });
                return playerList;
            };
            return (
                <div>
                    <h1>GameScoreBoard</h1>
                    <table className="table">
                        <thead>
                            <tr>{renderPlayerList()}</tr>
                        </thead>
                        <GameScores gid={this.props.gid} />
                    </table>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-2">
                                <button
                                    className="btn btn-primary position-fixed gsb-start-btn"
                                    onClick={() =>
                                        this.setState({ modalShow: true })
                                    }
                                >
                                    Add score
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-2">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={() =>
                                        this.setState({ modalShow: true })
                                    }
                                >
                                    Add score
                                </button>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-danger w-100">
                                    End game
                                </button>
                            </div>
                        </div>
                    </div>

                    <GameAddScore
                        show={this.state.modalShow}
                        onHide={modalClose}
                        uid={this.props.uid}
                        gid={this.props.gid}
                    />
                </div>
            );
        }
        return <div>loading scoreboard...</div>;
    }
}

export default GameScoreBoard;
