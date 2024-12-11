import React from "react";

export default ToggleSwitch = (props) => {
  console.log(props);
  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        className="toggle-switch-checkbox"
        name={props.name}
        id={props.name}
        checked={props.checked}
        onChange={props.onChange}
      />
      <label
        className="toggle-switch-label"
        htmlFor={props.name}
      >
        <span className="toggle-switch-inner"/>
        <span className="toggle-switch-switch"/>
      </label>
    </div>
  )
}
