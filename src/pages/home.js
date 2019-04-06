import React from "react";
import Login from "../components/Login";
import { auth } from "../firebase";
import { Col, Row, Container } from "react-bootstrap";
import Dashboard from "./dashboard";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isInGame: false
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(currentUser => {
            this.setState({ currentUser });
        });
    }

    render() {
        const { currentUser } = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h1>Home page</h1>
                        {!currentUser && <Login />}
                        {currentUser && <Dashboard user={currentUser} />}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home;
