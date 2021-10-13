import React, { Component } from "react";
import "./styles/ToastWrapper.css";
import Toast from "./Toast";
import PropTypes from "prop-types";
import ActionButton from "./ActionButton";

class ToastWrapper extends Component {
  constructor(props) {
    super(props);

    // Refs
    this.rootRef = React.createRef();

    // Binding Methods
    this.removeAll = this.removeAll.bind(this);
    this.add = this.add.bind(this);
    this.wait = this.wait.bind(this);
    this.getToastsNumber = this.getToastsNumber.bind(this);    
    this.waitOverflowToasts = this.waitOverflowToasts.bind(this);
    this.removeQueueToasts = this.removeQueueToasts.bind(this);
    this.getQueueToastsNumber = this.getQueueToastsNumber.bind(this);
    this.setSpacing = this.setSpacing.bind(this);

    // State Object
    this.state = {
      toasts: [],
      removeAllContainer: (
        <ActionButton
          text={this.props.removeAllText}
          type={this.props.type}
          actionStyle1={2}
          onClick={this.removeAll}
        />
      ),
      toastKey: 0,
    };
    this.toastsQueue = [];
    this.delayedToasts = [];
  }
  setSpacing() {
    let current = this.rootRef.current;
    current.style.gap = `${this.props.spacing}px`;
  }
  getQueueToastsNumber() {
    return this.toastsQueue.length;
  }
  removeQueueToasts() {
    this.toastsQueue = [];
  }
  getToastsNumber() {
    let current = this.rootRef.current;
    let number = Array.from(current.querySelectorAll(".Toast")).length;
    return number;
  }
  wait(ms) {
    let promise = new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
    return promise;
  }
  removeAll() {
    let current = this.rootRef.current;
    current.style.display = "none";
    Array.from(current.children).forEach((child) => {
      if (!child.classList.contains("ActionButton") && child !== null)
        child.remove();
    });
  }
  waitOverflowToasts() {
    let interval = setInterval(() => {
      if (this.toastsQueue.length === 0) clearInterval(interval);
      if (
        this.props.limit >
        this.getToastsNumber() + this.delayedToasts.length
      ) {
        this.add(this.toastsQueue[0]);
        this.toastsQueue.shift();
        clearInterval(interval);
      }
    }, 100);
  }
  add(toast) {
    if (toast === undefined) return;
    if (
      this.props.limit !== undefined &&
      this.props.limit === this.getToastsNumber() + this.delayedToasts.length
    ) {
      this.toastsQueue.push(toast);
      this.waitOverflowToasts();
      return;
    }
    let toastProps = { ...toast.props };
    toastProps.key = this.state.toastKey;
    if (this.props.animation) {
      toastProps.animation = this.props.animation;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.type) {
      toastProps.type = this.props.type;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.autoRemove !== undefined) {
      toastProps.autoRemove = this.props.autoRemove;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.theme) {
      toastProps.theme = this.props.theme;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.removeWhenClick) {
      toastProps.removeWhenClick = this.props.removeWhenClick;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.delay) {
      toastProps.delay = this.props.delay;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.direction) {
      toastProps.direction = this.props.direction;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.showProgress !== undefined) {
      toastProps.showProgress = this.props.showProgress;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.pauseWhenHover !== undefined) {
      toastProps.pauseWhenHover = this.props.pauseWhenHover;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.removeWhenDrag !== undefined) {
      toastProps.removeWhenDrag = this.props.removeWhenDrag;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.pauseWhenWindowUnfocus !== undefined) {
      toastProps.pauseWhenWindowUnfocus = this.props.pauseWhenWindowUnfocus;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.duration !== undefined) {
      toastProps.duration = this.props.duration;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.icon) {
      toastProps.icon = this.props.icon;
      toast = <Toast {...toastProps} />;
    }
    if (this.props.animationDuration) {
      toastProps.animationDuration = this.props.animationDuration;
      toast = <Toast {...toastProps} />;
    } else {
      toast = <Toast {...toastProps} />;
    }
    let newToastKey = this.state.toastKey + 1;
    let delay = parseInt(toastProps.delay) + 1; // +1 here is to add a tiny delay to the toast displaying.
    if (delay > 0) this.delayedToasts.push(toast);
    setTimeout(() => {
      this.delayedToasts.pop();
      this.state.toasts.push(toast);
      let newToasts = this.state.toasts;
      this.setState({ toasts: newToasts, toastKey: newToastKey }, () => {
        let current = this.rootRef.current;
        current.scrollTop = current.scrollHeight;
      });
    }, delay);
  }
  componentDidMount() {
    this.setSpacing();
  }
  render() {
    return (
      <div
        className={`ToastWrapper toast-wrapper-${
          this.props.placement
        } toast-wrapper-${
          this.props.direction !== undefined ? this.props.direction : "ltr"
        }`}
        id={this.props.id}
        ref={this.rootRef}
        onClick={this.props.onClick}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onMouseOver={this.props.onMouseOver}
        style={this.props.style}
      >
        {this.props.children}
        {this.state.toasts.map((toast) => {
          return toast;
        })}
        {this.props.userCanRemoveAll ? this.state.removeAllContainer : null}
      </div>
    );
  }
}

ToastWrapper.propTypes = {
  placement: PropTypes.string,
  animation: PropTypes.string,
  userCanRemoveAll: PropTypes.bool,
  removeAllText: PropTypes.string,
  limit: PropTypes.number,
  spacing: PropTypes.number,
};
ToastWrapper.defaultProps = {
  placement: "bottom-right",
  userCanRemoveAll: false,
  removeAllText: "Remove All",
  limit: undefined,
  spacing: 10,
};

export default ToastWrapper;
