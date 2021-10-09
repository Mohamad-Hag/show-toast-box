import React, { Component } from "react";
import PropTypes from "prop-types";
import "./styles/ActionButton.css";

class ActionButton extends Component {
  constructor(props) {
    super(props);

    // Refs
    this.rootRef = React.createRef();

    // State Object
    this.state = {};

    // Binding Methods
  }
  componentDidMount() {
    let span = this.rootRef.current.querySelector("span");
    let i = this.rootRef.current.querySelector("i");
    if (this.props.actionStyle === 2) {
      if (this.props.type === "info") span.style.color = "var(--info-cr)";
      else if (this.props.type === "success")
        span.style.color = "var(--success-cr)";
      else if (this.props.type === "warning")
        span.style.color = "var(--warning-cr)";
      else if (this.props.type === "error")
        span.style.color = "var(--error-cr)";
      else if (this.props.type === "standard")
        span.style.color = "var(--standard-cr)";
    }
    if (this.props.iconClass) {
      if (this.props.type === "info") i.style.color = "var(--info-cr)";
      else if (this.props.type === "success")
        i.style.color = "var(--success-cr)";
      else if (this.props.type === "warning")
        i.style.color = "var(--warning-cr)";
      else if (this.props.type === "error") i.style.color = "var(--error-cr)";
      else if (this.props.type === "standard")
        i.style.color = "var(--standard-cr)";
    }
  }
  render() {
    return (
      <button
        className={`ActionButton action-button-${this.props.type} action-button-${this.props.actionStyle}`}
        id={this.props.id}
        ref={this.rootRef}
        onClick={this.props.onClick}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onMouseOver={this.props.onMouseOver}
        style={this.props.style}
      >
        <span>{this.props.text}</span>
        {this.props.iconClass ? <i className={this.props.iconClass}></i> : null}
      </button>
    );
  }
}

ActionButton.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  actionStyle: PropTypes.number,
};

ActionButton.defaultProps = {
  text: "Action Text",
  type: "standard",
  actionStyle: 1,
  onClick: () => {
    alert("Action Button Clicked!");
  },
};
export default ActionButton;
