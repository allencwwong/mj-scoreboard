import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { database, auth } from "../firebase";
import { Col, Row, Container, Card } from "react-bootstrap";
import "./dashboard.css";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.gameroomsRef = database.ref("/gamerooms");
        this.inGameUsers = database.ref("/ingameusers");
        this.state = {
            user: this.props.user,
            isInGame: false
        };
    }

    createGameRoom = () => {
        const { user } = this.props;
        // set host info
        let host = {};
        host[user.uid] = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        };
        console.log(host);
        // push host info and create new game room in db
        const gid = this.gameroomsRef.push({
            players: host,
            status: "open",
            host: user.uid
        }).key;

        console.log(user.uid);
        // set host as in game user
        this.inGameUsers
            .child(user.uid)
            .set({ gid: gid, user: user.displayName })
            .then(() => {
                // redirect to create page
                this.props.history.push(`/gameroom/${gid}?uid=${user.uid}`);
            });
    };

    handleLogOut = () => {
        auth.signOut().then(() => {
            this.setState({
                user: {
                    email: "",
                    displayName: "",
                    uid: ""
                }
            });
        });
    };

    componentDidMount() {
        console.log(this.inGameUsers);
        this.inGameUsers.on("value", snapshot => {
            if (snapshot.exists()) {
                if (snapshot.val()[this.state.user.uid]) {
                    let ingameUserGid = snapshot.val()[this.state.user.uid].gid;
                    this.gameroomsRef
                        .child(ingameUserGid)
                        .on("value", snapshot => {
                            this.setState({
                                gid: ingameUserGid,
                                players: snapshot.val().players,
                                isInGame: true,
                                status: snapshot.val().status
                            });
                        });
                }
            }
        });
    }

    render() {
        const { user } = this.state;
        console.log(
            "user2",
            user,
            user.email,
            user.displayName,
            user.uid,
            user.photoURL
        );
        return (
            <Container>
                welcome,
                {user.displayName} ,{" "}
                <a href="#" onClick={this.handleLogOut}>
                    logout
                </a>
                {this.state.isInGame ? (
                    ""
                ) : (
                    <Row>
                        <button
                            onClick={this.createGameRoom}
                            className="btn btn-primary"
                        >
                            Create new game
                        </button>
                        <Link
                            to={{
                                pathname: "/join",
                                state: {
                                    user: {
                                        email: user.email,
                                        uid: user.uid,
                                        displayName: user.displayName,
                                        photoURL: user.photoURL
                                    }
                                }
                            }}
                        >
                            <button className="btn btn-primary">
                                Join game
                            </button>
                        </Link>
                    </Row>
                )}
                {this.state.isInGame ? (
                    <Row>
                        <Col sm={12}>
                            <Link
                                to={`/gameroom/${this.state.gid}/?uid=${
                                    this.state.user.uid
                                }`}
                            >
                                <Card body>
                                    <Row>
                                        <Col>Game: {this.state.gid}</Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            Players:
                                            {Object.keys(this.state.players)
                                                .map(key => {
                                                    return this.state.players[
                                                        key
                                                    ].displayName;
                                                })
                                                .join(" ")}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>Status: {this.state.status}</Col>
                                    </Row>
                                </Card>
                            </Link>
                        </Col>
                    </Row>
                ) : (
                    ""
                )}
            </Container>
        );
    }
}

export default withRouter(Dashboard);
