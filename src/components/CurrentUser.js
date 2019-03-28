import React from "react";
import PropTypes from "prop-types";

const CurrentUser = ({ user }) => {
  console.log("currentuser:", user);
  return <div>{user.displayName}</div>;
};

CurrentUser.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
    photoURL: PropTypes.string,
    uid: PropTypes.string.isRequired
  })
};

export default CurrentUser;
