import React, { Component } from "react";
import PropTypes from "prop-types";
import "./styles/Toast.css";
import ActionButton from "./ActionButton";
import CircleLoader from "./CircleLoader";

class Toast extends Component {
  constructor(props) {
    super(props);

    // Refs
    this.rootRef = React.createRef();

    // Vars
    this.timeout = undefined;
    this.timeoutMS = 0;
    this.readingTimeMS = 0;
    this.isPointerDowned = false;
    this.cmx = 0; // Mouse X Coordinate
    this.cmy = 0; // Mouse Y Coordinate

    // State Object
    this.state = {};

    // Binding Methods
    this.closeClicked = this.closeClicked.bind(this);
    this.close = this.close.bind(this);
    this.add = this.add.bind(this);
    this.readingTime = this.readingTime.bind(this);
    this.mouseMoved = this.mouseMoved.bind(this);
    this.mouseDowned = this.mouseDowned.bind(this);
    this.mouseUpped = this.mouseUpped.bind(this);
    this.mouseLeaved = this.mouseLeaved.bind(this);
    this.touchStarted = this.touchStarted.bind(this);
    this.touchEnded = this.touchEnded.bind(this);
    this.touchMoved = this.touchMoved.bind(this);
    this.mouseClicked = this.mouseClicked.bind(this);
    this.mouseOvered = this.mouseOvered.bind(this);
    this.countToasts = this.countToasts.bind(this);
    this.pauseToast = this.pauseToast.bind(this);
    this.resumeToast = this.resumeToast.bind(this);
    this.removeTooltip = this.removeTooltip.bind(this);
    this.setAnimationDuration = this.setAnimationDuration.bind(this);
    this.catchToast = this.catchToast.bind(this);
    this.releaseToast = this.releaseToast.bind(this);
    this.dragToast = this.dragToast.bind(this);
    this.setRTLProperties = this.setRTLProperties.bind(this);
    this.getDescription = this.getDescription.bind(this);
  }
  getDescription() {
    return this.props.description ? <p>{this.props.description}</p> : null;
  }
  releaseToast() {
    if (!this.props.removeWhenDrag || this.props.loading) return;
    let current = this.rootRef.current;
    let width = current.offsetWidth;
    let left = parseInt(getComputedStyle(current).getPropertyValue("left"));
    let absLeft = Math.abs(left);
    this.isPointerDowned = false;
    current.style.transition = `${this.props.animationDuration}ms`;
    setTimeout(() => {
      if (absLeft > width / 2) {
        current.style.filter = `opacity(0)`;
        current.style.left = left < 0 ? `${-width}px` : `${width}px`;
        setTimeout(() => {
          this.close();
        }, this.props.animationDuration);
        return;
      }
      current.style.filter = `opacity(1)`;
      current.style.left = "0";
    }, 10);
  }
  dragToast(x, y) {
    if (!this.props.removeWhenDrag || this.props.loading) return;
    let current = this.rootRef.current;
    let width = current.offsetWidth;
    let left = Math.abs(
      parseInt(getComputedStyle(current).getPropertyValue("left"))
    );
    let ratio = (left / width).toFixed(1);
    if (this.isPointerDowned) {
      current.style.filter = `opacity(${1 - ratio})`;
      current.style.left = `${x - this.cmx}px`;
    }
  }
  catchToast(x, y) {
    if (!this.props.removeWhenDrag || this.props.loading) return;
    let current = this.rootRef.current;
    this.isPointerDowned = true;
    current.style.transition = "0s";
    let left = parseInt(getComputedStyle(current).getPropertyValue("left"));
    this.cmx = x - left;
  }
  touchMoved(e) {
    let evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    let touch = evt.touches[0] || evt.changedTouches;
    this.dragToast(touch.pageX, touch.pageY);
  }
  mouseDowned(e) {
    this.catchToast(e.clientX, e.clientY);
  }
  mouseUpped(e) {
    this.releaseToast();
  }
  touchStarted(e) {
    let evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    let touch = evt.touches[0] || evt.changedTouches;
    this.catchToast(touch.pageX, touch.pageY);
  }
  touchEnded(e) {
    this.releaseToast();
  }
  setAnimationDuration() {
    let current = this.rootRef.current;
    current.style.transition = `${this.props.animationDuration}ms`;
  }
  resumeToast() {
    let current = this.rootRef.current;
    if (this.props.showProgress) {
      let progress = current.querySelector(".toast-progress");
      if (progress) progress.style.animationPlayState = "running";
    }
    let left = this.timeoutMS;
    this.timeoutMS = new Date();
    this.readingTimeMS = left;
    this.timeout = setTimeout(() => {
      this.close();
    }, left);
  }
  pauseToast() {
    if (this.props.showProgress) {
      let current = this.rootRef.current;
      let progress = current.querySelector(".toast-progress");
      if (progress) progress.style.animationPlayState = "paused";
    }
    let readingTime = this.readingTimeMS;
    this.timeoutMS = readingTime - (new Date() - this.timeoutMS);
    clearTimeout(this.timeout);
  }
  mouseOvered(e) {
    if (
      this.props.autoRemove &&
      this.props.pauseWhenHover &&
      !this.props.loading
    )
      this.pauseToast();
  }
  countToasts() {
    let current = this.rootRef.current;
    let parent = current.parentElement;
    let childs = Array.from(parent.children);
    let count = 0;
    if (parent !== null && parent.classList.contains("ToastWrapper")) {
      for (let child of childs) {
        if (child.classList.contains("Toast")) count++;
      }
      return count;
    }
    return 1;
  }
  mouseClicked(e) {
    if (
      !this.props.removeWhenClick ||
      e.target.classList.contains("ActionButton") ||
      e.target.parentElement.classList.contains("ActionButton") ||
      this.props.loading
    )
      return;
    this.close();
  }
  removeTooltip() {
    let current = this.rootRef.current;
    if (!this.props.removeWhenClick || this.props.loading) return;
    let tooltip = current.querySelector(".toast-dismiss-tooltip");
    tooltip.style.display = "none";
  }
  mouseLeaved(e) {
    this.releaseToast();
    if (
      this.props.autoRemove &&
      this.props.pauseWhenHover &&
      !this.props.loading
    )
      this.resumeToast();
    this.removeTooltip();
  }
  mouseMoved(e) {
    this.dragToast(e.clientX, e.clientY);
    let elementUnder = document.elementsFromPoint(e.clientX, e.clientY)[0];
    if (
      elementUnder.classList.contains("ActionButton") ||
      elementUnder.parentElement.classList.contains("ActionButton") ||
      this.props.loading
    ) {
      this.removeTooltip();
      return;
    }
    if (!this.props.removeWhenClick) return;
    let current = this.rootRef.current;
    let tooltip = current.querySelector(".toast-dismiss-tooltip");
    tooltip.style.display = "block";
    let rect = current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y + 10}px`;
    tooltip.style.zIndex = document.querySelectorAll("*").length + 1;
  }
  readingTime(text) {
    const wordsPerMinute = 200;
    const oneMinute = 60000; // In milliseconds
    const words = text.split(/\s/g).length;
    const ms = (words * oneMinute) / wordsPerMinute;
    const readTime = Math.ceil(ms);
    return readTime;
  }
  close() {
    let current = this.rootRef.current;
    current.classList.remove("toast-added");
    let delay =
      this.props.animation === "none" || this.props.animation[0] === ">"
        ? 0
        : this.props.animationDuration;
    setTimeout(() => {
      let parent = current.parentElement;
      if (
        parent !== null &&
        parent.classList.contains("ToastWrapper") &&
        this.countToasts() === 1
      )
        parent.style.display = "none";
      if (current) current.remove();
    }, delay);
    if (this.props.onRemove) this.props.onRemove(current);
  }
  add() {
    let current = this.rootRef.current;
    let parent = current.parentElement;
    if (
      parent !== null &&
      parent.classList.contains("ToastWrapper") &&
      this.countToasts() === 1
    )
      parent.style.display = "flex";
    setTimeout(() => {
      current.classList.add("toast-added");
    }, 50);
    if (this.props.autoRemove && !this.props.loading) {
      let readingTime = this.readingTime(
        `${this.props.description}  ${this.props.title}`
      );
      if (
        this.props.duration !== undefined &&
        this.props.duration > 0 &&
        typeof this.props.duration === "number"
      )
        readingTime = this.props.duration;
      this.readingTimeMS = readingTime;
      if (this.props.showProgress === true) {
        let progress = current.querySelector(".toast-progress");
        progress.style.animationDuration = `${readingTime}ms`;
        setTimeout(() => {
          progress.classList.add("toast-progress-start");
        }, 5);
      }
      this.timeoutMS = new Date();
      this.timeout = setTimeout(() => {
        this.close();
      }, readingTime);
    }
  }
  closeClicked() {
    this.close();
  }
  setRTLProperties() {
    let current = this.rootRef.current;
    if (this.props.direction === "rtl") {
      current.style.borderRightColor = `var(--${this.props.type}-cr)`;
      current.style.borderRightWidth = `5px`;
      current.style.borderLeftWidth = `1px`;
      current.style.borderLeftColor = `var(--${this.props.theme}-border-cr)`;
    }
  }
  componentDidMount() {
    window.onmouseup = () => {
      this.releaseToast();
    };
    this.setAnimationDuration();
    this.setRTLProperties();
    this.add();
    // if (this.props.autoRemove && this.props.pauseWhenWindowUnfocus) {
    //   document.body.addEventListener("mouseleave", this.pauseToast());
    //   window.addEventListener("focus", this.resumeToast());
    // }
  }
  componentDidUpdate() {}
  render() {
    return (
      <div
        className={`
        Toast 
        ${
          this.props.theme === "colorful"
            ? `toast-colorful-${this.props.type}`
            : `toast-${this.props.type}`
        }
        toast-${this.props.theme}-theme
        ${
          this.props.animation[0] === ">"
            ? this.props.animation
                .substr(1, this.props.animation.length - 1)
                .trim()
            : `toast-${this.props.animation}`
        }        
        toast-${this.props.direction}`}
        id={this.props.id}
        ref={this.rootRef}
        onClick={this.mouseClicked}
        onMouseDown={this.mouseDowned}
        onTouchStart={this.touchStarted}
        onTouchMove={this.touchMoved}
        onTouchEnd={this.touchEnded}
        onMouseUp={this.mouseUpped}
        onMouseEnter={this.mouseOvered}
        style={this.props.style}
        onMouseMove={this.mouseMoved}
        onMouseLeave={this.mouseLeaved}
      >
        {this.props.loading ? (
          <CircleLoader
            style={{ width: "100%" }}
            type={
              this.props.theme === "colorful" ? "standard" : this.props.type
            }
            direction={this.props.direction}
            theme={this.props.theme}
            size={this.props.loaderSize}
            text={this.props.loaderText}
            loading={this.props.loaderLoading}
            loaded={this.props.loaderLoaded}
          />
        ) : (
          <div className="toast-top-container">
            {this.props.removeWhenClick ? (
              <div className="toast-dismiss-tooltip">
                {this.props.removeWhenClickText}
              </div>
            ) : null}
            <div className="toast-left-container">
              {this.props.icon ? (
                <i className="toast-custom-icon">{this.props.icon}</i>
              ) : (
                <i
                  className={`bi bi-${
                    this.props.type === "error"
                      ? "x-circle-fill"
                      : this.props.type === "warning"
                      ? "exclamation-triangle-fill"
                      : this.props.type === "success"
                      ? "check-circle-fill"
                      : "info-circle-fill"
                  } toast-icon`}
                ></i>
              )}
              <div className="toast-details-container">
                <span>{this.props.title}</span>
                {this.getDescription()}
              </div>
            </div>
            {this.props.autoRemove || this.props.removeWhenClick ? null : (
              <i
                onClick={this.closeClicked}
                className="bi bi-x toast-close-btn"
              ></i>
            )}
          </div>
        )}
        {this.props.action1 ||
        this.props.action2 ||
        this.props.actionTitle1 ||
        this.props.actionTitle2 ? (
          <div className="toast-bottom-container">
            {this.props.action2 || this.props.actionTitle2 ? (
              <ActionButton
                text={this.props.actionTitle2}
                type={
                  this.props.theme === "colorful" ? "standard" : this.props.type
                }
                actionStyle={2}
                onMouseUp={this.close}
                onClick={this.props.action2}
                iconClass={this.props.actionIcon2}
              />
            ) : null}
            <ActionButton
              text={this.props.actionTitle1}
              type={
                this.props.theme === "colorful" ? "standard" : this.props.type
              }
              onClick={this.props.action1}
              onMouseUp={this.close}
              iconClass={this.props.actionIcon1}
            />
          </div>
        ) : null}
        {this.props.autoRemove &&
        this.props.showProgress &&
        !this.props.loading ? (
          <div className="toast-progress"></div>
        ) : null}
      </div>
    );
  }
}

Toast.propTypes = {
  type: PropTypes.string,
  theme: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  autoRemove: PropTypes.bool,
  animation: PropTypes.string,
  onRemove: PropTypes.func,
  removeWhenClick: PropTypes.bool,
  direction: PropTypes.string,
  removeWhenClickText: PropTypes.string,
  loading: PropTypes.bool,
  delay: PropTypes.number,
  showProgress: PropTypes.bool,
  pauseWhenHover: PropTypes.bool,
  pauseWhenWindowUnfocus: PropTypes.bool,
  duration: PropTypes.number,
  icon: PropTypes.any,
  animationDuration: PropTypes.number,
  removeWhenDrag: PropTypes.bool,
};

Toast.defaultProps = {
  type: "info",
  theme: "light",
  title: "Toast Title ✨",
  description: "",
  autoRemove: false,
  animation: "slide-down",
  removeWhenClick: false,
  direction: "ltr",
  removeWhenClickText: "Click to dismiss",
  loading: false,
  loaderText: "Loading in progress...",
  delay: 0,
  showProgress: true,
  pauseWhenHover: true,
  pauseWhenWindowUnfocus: true,
  duration: undefined,
  icon: undefined,
  animationDuration: 500,
  removeWhenDrag: false,
};

export default Toast;

/** 
 * Toast Properties---------------------------------------------------------------
╔═════════════════════╦══════════╦═══════════════════════════════════════════════╗
║                     ║ Type     ║ Values                                        ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ title               ║ string   ║ any string                                    ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ description         ║ string   ║ any string                                    ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ type                ║ string   ║ info, warning, error, success                 ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ theme               ║ string   ║ light, dark, colorful                         ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ autoRemove          ║ boolean  ║ true, false                                   ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ animation           ║ string   ║ slide-down, slide-up, slide-left, slide-right ║
║                     ║          ║ zoom-in, zoom-out                             ║
║                     ║          ║ none                                          ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ onRemove            ║ function ║ any function                                  ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ removeWhenClick     ║ boolean  ║ true, false                                   ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ direction           ║ string   ║ ltr, rtl                                      ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ removeWhenClickText ║ string   ║ any string                                    ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ loading             ║ boolean  ║ true, false                                   ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ loaderText          ║ string   ║ any string                                    ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ loaderLoaded        ║ boolean  ║ true, false                                   ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ loaderSize          ║ string   ║ small, medium, large                          ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ delay               ║ number   ║ any integer number >= 0                       ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ showProgress        ║ boolean  ║ true, false                                   ║
╠═════════════════════╬══════════╬═══════════════════════════════════════════════╣
║ pauseWhenHover      ║ boolean  ║ true, false                                   ║
╚═════════════════════╩══════════╩═══════════════════════════════════════════════╝
**/
