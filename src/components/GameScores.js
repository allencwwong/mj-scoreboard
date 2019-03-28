import React, { Component } from "react";
import { database } from "../firebase";

class GameScores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: null
        };
        this.gameroomsRef = database.ref("/gamerooms");
    }

    componentDidMount() {
        const { gid } = this.props;
        let players,
            playerList,
            results = "";

        this.gameroomsRef.child(`${gid}/players`).on("value", snapshot => {
            players = snapshot.val();
            playerList = Object.keys(players);

            this.gameroomsRef
                .child(`${gid}/scoreboard`)
                .on("value", snapshot => {
                    if (snapshot.val()) {
                        console.log(snapshot.val());
                        let rounds = snapshot.val();
                        results = "";
                        Object.keys(rounds).reduce((acc, key) => {
                            let roundScores = rounds[key].scores;
                            let roundScoreList = Object.keys(roundScores);
                            results += "<tr>";

                            playerList.forEach(uid => {
                                if (roundScoreList.indexOf(uid) !== -1) {
                                    results += `<td>${
                                        roundScores[uid].pointsValue
                                    }</td>`;
                                } else {
                                    results += "<td>-</td>";
                                }
                            });

                            results += "</tr>";
                        }, 0);

                        console.log(results);

                        this.setState({
                            results: results
                        });
                    } else {
                        this.setState({
                            results: "no score available"
                        });
                    }
                });
        });
    }

    render() {
        return (
            <tbody dangerouslySetInnerHTML={{ __html: this.state.results }} />
        );
    }
}

export default GameScores;
