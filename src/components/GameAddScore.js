import React, { Component } from "react";
import { database } from "../firebase";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Checkbox from "./Checkbox";
import GamePointSelection from "./GamePointSelection";

let OPTIONS = [];

class GameScoreBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoad: false,
            checkboxes: [],
            isMaxPoints: false,
            isRequiredMet: false,
            checkedBoxes: 0
        };
        this.gameroomsRef = database.ref("/gamerooms");
    }

    handleCheckboxChange = changeEvent => {
        const { name, dataset } = changeEvent.target;
        console.log(dataset.uid);
        console.log(this.state.checkboxes.checkboxPlayers);
        let uid = dataset.uid,
            isSelected = this.state.checkboxes.checkboxPlayers[uid].isSelected;
        // set selected player info and mark checkbox selected
        let checkboxPlayers = this.state.checkboxes.checkboxPlayers;
        checkboxPlayers[uid].isSelected = !isSelected;

        console.log(this.state.checkboxes.checkboxPlayers);

        this.setState({
            checkboxes: {
                checkboxPlayers
            }
        });

        let checkedbox = this.state.checkedBoxes;
        isSelected = !isSelected;
        if (isSelected) {
            this.setState({
                checkedBoxes: (checkedbox += 1),
                isRequiredMet: true
            });
            console.log(
                "true:",
                this.state.checkedBoxes,
                "req:",
                this.state.isRequiredMet
            );
        } else if (this.state.checkedBoxes === 1) {
            console.log(
                "false",
                this.state.checkedBoxes,
                "req:",
                this.state.isRequiredMet
            );
            this.setState({
                checkedBoxes: (checkedbox -= 1),
                isRequiredMet: false
            });
        }
    };

    handlePointSelectionChange = event => {
        let points = event.target.value;
        this.setState({
            points: parseInt(points)
        });
        if (points === "10+") {
            this.setState({
                isMaxPoints: true
            });
        } else {
            this.setState({
                isMaxPoints: false
            });
        }
    };

    handleFormSubmit = event => {
        event.preventDefault();
        console.log("submit form");
        const { winnerUid } = this.state;
        let points,
            winType = "single",
            status;
        // push score data to firebase
        if (this.state.isRequiredMet) {
            this.gameroomsRef
                .child(`${this.props.gid}/players`)
                .on("value", snapshot => {
                    let playersUid = snapshot.val();
                    let loserList = Object.keys(
                        this.state.checkboxes.checkboxPlayers
                    ).filter(
                        uid =>
                            this.state.checkboxes.checkboxPlayers[uid]
                                .isSelected === true
                    );
                    let noPointList = Object.keys(
                        this.state.checkboxes.checkboxPlayers
                    ).filter(
                        uid =>
                            this.state.checkboxes.checkboxPlayers[uid]
                                .isSelected === false
                    );
                    console.log("lose list", loserList);
                    console.log("NP list", noPointList);
                    if (loserList.length === 3) {
                        winType = "all";
                    }
                    // set W/L/NA status for all players
                    Object.keys(playersUid).forEach(uid => {
                        if (uid === winnerUid) {
                            status = "winner";
                            points = this.state.points;
                        } else if (loserList.indexOf(uid) > -1) {
                            status = "loser";
                            points = this.state.points;
                        } else if (noPointList.indexOf(uid) > -1) {
                            status = "NA";
                            points = 0;
                        }
                        console.log(status, points, winType);
                        this.gameroomsRef
                            .child(`${this.props.gid}/scoreboard/${uid}`)
                            .push({
                                status: status,
                                points: points,
                                winType: winType
                            });
                    });
                });

            // set reset checkBoxes , isRequiredMet
            this.setState({
                checkedBoxes: 0,
                isRequiredMet: false
            });
            // close modal
            this.props.onHide();
        } else {
            alert("select loser!");
        }
    };

    createCheckbox = option => {
        return (
            <Checkbox
                label={option.name}
                isSelected={this.state.checkboxes.checkboxPlayers.isSelected}
                onCheckboxChange={this.handleCheckboxChange}
                key={option.uid}
                uid={option.uid}
            />
        );
    };

    //   generate checkbox instances
    createCheckboxes = () => OPTIONS.map(this.createCheckbox);

    componentDidMount() {
        this.gameroomsRef.child(this.props.gid).on("value", snapshot => {
            let players = snapshot.val().players,
                playerUids = Object.keys(players),
                checkboxPlayers = {};

            this.setState({
                winnerUid: this.props.uid,
                winner: players[this.props.uid].displayName,
                points: 3
            });

            // reset OPTIONS
            OPTIONS = [];
            // init checkboxPlayers
            playerUids.forEach((uid, idx, arr) => {
                if (this.props.uid !== uid) {
                    checkboxPlayers[uid] = {};
                    checkboxPlayers[uid].name = players[uid].displayName;
                    checkboxPlayers[uid].isSelected = false;
                    console.log(checkboxPlayers);
                    // set options for checkbox
                    OPTIONS.push({
                        uid: uid,
                        name: players[uid].displayName,
                        isSelected: false
                    });
                }
                this.setState({
                    checkboxes: {
                        checkboxPlayers
                    }
                });
                if (idx === arr.length - 1) {
                    this.setState({
                        isLoad: true
                    });
                }
            });
        });
    }

    render() {
        if (this.state.isLoad) {
            return (
                <Modal
                    {...this.props}
                    aria-labelledby="contained-modal-title-vcenter"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Score
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.handleFormSubmit}>
                        <Modal.Body>
                            <Container>
                                <Row className="show-grid">
                                    <Col xs={12}>
                                        <p>Winner: {this.state.winner}</p>
                                    </Col>
                                </Row>
                                <Row className="show-grid">
                                    <Col xs={12}>
                                        <h3>Losers:</h3>
                                        {this.createCheckboxes()}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <GamePointSelection
                                            isMaxPoints={this.state.isMaxPoints}
                                            onPointSelectionChange={
                                                this.handlePointSelectionChange
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.props.onHide}>Close</Button>
                            <button
                                onClick={this.handleFormSubmit}
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save
                            </button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            );
        }
        return <div>loading add score...</div>;
    }
}

export default GameScoreBoard;
