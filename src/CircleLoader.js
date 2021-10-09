import React, { Component } from "react";
import PropTypes from "prop-types";
import "./styles/CircleLoader.css";

class CircleLoader extends Component {
  constructor(props) {
    super(props);

    // Refs
    this.rootRef = React.createRef();

    // State Object
    this.state = {};

    // Binding Methods
    this.remove = this.remove.bind(this);
  }
  remove()
  {
      let current = this.rootRef.current;
      current.remove();
  }
  componentDidMount() {}
  render() {
    return (
      <div
        className={`CircleLoader circle-loader-${this.props.size} circle-loader-${this.props.type} circle-loader-${this.props.theme} circle-loader-${this.props.direction}`}
        id={this.props.id}
        ref={this.rootRef}
        onClick={this.props.onClick}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onMouseOver={this.props.onMouseOver}
        style={this.props.style}
      >
        {!this.props.loaded ? (
          <div className="circle-loader-inner">
            <div
              className={`circle-loader-circle circle-loader-loading-${this.props.loading}`}
            ></div>
            {this.props.imgSrc ? <img alt="" src={this.props.imgSrc} /> : null}
          </div>
        ) : (
          <i className="bi bi-check-circle-fill"></i>
        )}
        {this.props.text ? <p>{this.props.text}</p> : null}
      </div>
    );
  }
}

CircleLoader.propTypes = {
  imgSrc: PropTypes.string,
  text: PropTypes.string,
  isLoading: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string,
  theme: PropTypes.string,
  loaded: PropTypes.bool,
  direction: PropTypes.string,
};
CircleLoader.defaultProps = {
  imgSrc: undefined,
  text: undefined,
  loading: true,
  size: "small",
  type: "info",
  theme: "light",
  loaded: false,
  direction: "ltr",
};
export default CircleLoader;
