import React from "react";

const Checkbox = ({ label, isSelected, onCheckboxChange, uid }) => (
  <div className="form-check">
    <label>
      <input
        type="checkbox"
        name={label}
        checked={isSelected}
        onChange={onCheckboxChange}
        className="form-check-input"
        data-uid={uid}
        required
      />
      {label}
    </label>
  </div>
);

export default Checkbox;
