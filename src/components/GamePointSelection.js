import React from "react";

const GamePointSelection = ({ isMaxPoints, onPointSelectionChange }) => (
  <div>
    <label>
      Winning Pts:
      <select
        onChange={onPointSelectionChange}
        defaultValue={{ label: "3", value: 3 }}
        required
      >
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="10+">10+</option>
      </select>
    </label>
    <label>
      More than 10
      <input
        type="number"
        min="1"
        max="10"
        disabled={isMaxPoints ? "" : "disabled"}
      />
    </label>
  </div>
);

export default GamePointSelection;
