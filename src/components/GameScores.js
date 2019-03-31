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
        let scoreboard,
            scoreboardKeys,
            playersTotalScore = {},
            pointValue;

        let getObjKey = obj => {
            return Object.keys(obj);
        };

        // this.gameroomsRef.child(`${gid}/players`).on("value", snapshot => {
        this.gameroomsRef.child(`${gid}/scoreboard`).on("value", snapshot => {
            if (snapshot.val()) {
                scoreboard = snapshot.val();

                // organize db data to table format
                let sbTable = [];
                scoreboardKeys = getObjKey(scoreboard);
                scoreboardKeys.forEach(playerUid => {
                    let playerAllScore = scoreboard[playerUid];
                    let tableRow = [];
                    getObjKey(playerAllScore).forEach(scoreUid => {
                        let playerRoundScore = playerAllScore[scoreUid];
                        tableRow.push(playerRoundScore);
                    });
                    sbTable.push(tableRow);
                });

                // init playersTotalScore
                scoreboardKeys.forEach(playerUid => {
                    playersTotalScore[playerUid] = 0;
                });

                // set up table display with calc
                let results = () => {
                    let resultsHTML = "";
                    let displayRows = {};
                    sbTable.forEach((playerAllScores, sbTableIdx) => {
                        console.log(playerAllScores);
                        playerAllScores.forEach((playerScore, idx, arr) => {
                            if (!displayRows[idx]) {
                                displayRows[idx] = "<tr>";
                            }
                            if (playerScore.winType === "single") {
                                // calc point value
                                if (playerScore.status === "winner") {
                                    pointValue = 2 ** (playerScore.points + 2);
                                    // add points to total
                                    playersTotalScore[
                                        scoreboardKeys[sbTableIdx]
                                    ] += pointValue;
                                    // display pts in col
                                    displayRows[
                                        idx
                                    ] += `<td>${pointValue}</td>`;
                                } else {
                                    pointValue = -(
                                        2 **
                                        (playerScore.points + 2)
                                    );
                                    playersTotalScore[
                                        scoreboardKeys[sbTableIdx]
                                    ] += pointValue;
                                    displayRows[
                                        idx
                                    ] += `<td>${pointValue}</td>`;
                                }
                            } else if (playerScore.winType === "all") {
                                // calc point value
                                if (playerScore.status === "winner") {
                                    pointValue =
                                        2 ** (playerScore.points + 1) * 3;
                                    playersTotalScore[
                                        scoreboardKeys[sbTableIdx]
                                    ] += pointValue;
                                    displayRows[
                                        idx
                                    ] += `<td>${pointValue}</td>`;
                                } else {
                                    pointValue = -(
                                        2 **
                                        (playerScore.points + 1)
                                    );
                                    playersTotalScore[
                                        scoreboardKeys[sbTableIdx]
                                    ] += pointValue;
                                    displayRows[
                                        idx
                                    ] += `<td>${pointValue}</td>`;
                                }
                            }
                            // check if it is end of arr
                            if (arr.length - 1 === idx) {
                                if (!displayRows[idx]) {
                                    displayRows[idx] += "<tr>";
                                }
                            }
                        });
                    });

                    getObjKey(displayRows).forEach(rowId => {
                        resultsHTML += displayRows[rowId];
                    });

                    let totalHtml = "<tr>";
                    getObjKey(playersTotalScore).forEach(uid => {
                        totalHtml += `<td>${playersTotalScore[uid]}</td>`;
                    });
                    totalHtml += "</tr>";
                    resultsHTML = totalHtml + resultsHTML;

                    return resultsHTML;
                };

                this.setState({
                    results: results()
                });
            } else {
                this.setState({
                    results: "no score available"
                });
            }
        });
        // });
    }

    render() {
        return (
            <tbody dangerouslySetInnerHTML={{ __html: this.state.results }} />
        );
    }
}

export default GameScores;
