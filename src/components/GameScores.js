import React, { Component } from "react";
import { database } from "../firebase";
import "./GameScores.css";

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
            pointValue,
            resultsRankingHTML;

        let getObjKey = obj => {
            return Object.keys(obj);
        };

        this.gameroomsRef.child(`${gid}/scoreboard`).on("value", snapshot => {
            if (snapshot.val()) {
                scoreboard = snapshot.val();
                this.gameroomsRef
                    .child(`${gid}/players`)
                    .once("value", snapshot => {
                        let playersName = () => {
                            let displayNamesHTML = "";
                            let playersUid = getObjKey(scoreboard);
                            playersUid.forEach(uid => {
                                displayNamesHTML += `<td>${
                                    snapshot.val()[uid].displayName
                                }</td>`;
                            });
                            return displayNamesHTML;
                        };
                        this.setState({
                            playersName: playersName()
                        });
                    });

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
                let results = (() => {
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

                    // get total score and add as first row
                    let totalHtml = "<tr>";
                    // set total points
                    let totalPoints = {};
                    getObjKey(playersTotalScore).forEach(uid => {
                        totalPoints[uid] = playersTotalScore[uid];
                        totalHtml += `<td>${playersTotalScore[uid]}</td>`;
                    });

                    totalHtml += "</tr>";
                    resultsHTML = totalHtml + resultsHTML;

                    // get player info and setup ranking display
                    this.gameroomsRef
                        .child(`${gid}/players`)
                        .on("value", snapshot => {
                            let playersList = snapshot.val();
                            // sort total points
                            let sortedTotalPoints = getObjKey(playersList).sort(
                                (uidA, uidB) => {
                                    console.log(totalPoints[uidB]);
                                    return (
                                        totalPoints[uidB] - totalPoints[uidA]
                                    );
                                }
                            );
                            // render ranking
                            // '<tr><td>ranking #</td></tr>'
                            // '<tr><td>avatar / name </td></tr>'
                            resultsRankingHTML = "<tr>";
                            sortedTotalPoints.forEach(
                                (HiLoTotalPointsUid, idx) => {
                                    let playerName =
                                            playersList[HiLoTotalPointsUid]
                                                .displayName,
                                        playerAvatar =
                                            playersList[HiLoTotalPointsUid]
                                                .photoURL,
                                        playerTotalPoints =
                                            totalPoints[HiLoTotalPointsUid];
                                    resultsRankingHTML += `<td>Raking:${idx +
                                        1}<img class="avatar" src="${playerAvatar}"/>${playerName}${playerTotalPoints}</td>`;
                                }
                            );
                            resultsRankingHTML += "</tr>";
                        });

                    return {
                        resultScore: resultsHTML,
                        resultRanking: resultsRankingHTML
                    };
                })();
                this.setState({
                    results: results.resultScore,
                    resultsRanking: results.resultRanking
                });
            } else {
                this.setState({
                    results: "no score available"
                });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <h2>Rankings</h2>
                <table className="table">
                    <thead
                        dangerouslySetInnerHTML={{
                            __html: this.state.resultsRanking
                        }}
                    />
                </table>
                <h2>Scores</h2>
                <table className="table">
                    <thead>
                        <tr
                            dangerouslySetInnerHTML={{
                                __html: this.state.playersName
                            }}
                        />
                    </thead>
                    <tbody
                        dangerouslySetInnerHTML={{ __html: this.state.results }}
                    />
                </table>
            </React.Fragment>
        );
    }
}

export default GameScores;
