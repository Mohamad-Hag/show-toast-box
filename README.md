# Show-Toast-Box JS

[![npm version](https://badge.fury.io/js/show-toast-box.svg)](https://badge.fury.io/js/show-toast-box)
![npm version](https://img.shields.io/badge/target%20framework-ReactJS-blue)

![Show Toast Box](https://media.giphy.com/media/eBX2j1n97vvhpSsQeR/giphy.gif "Show Toast Box")

## Overview

Notifcation is one of the most important components of the application because it notifies system users of any urgent events or some sudden issues. Wherefore, Here come the role of ✨Show-Toast-Box.
<br/>
It is a lightweight react.js library to show a toasts and notifications within your react application.

## Getting Started

Intall Show-Toast-Box using **npm** such as the following:<br/>
`npm i show-toast-box`<br/><br/>
Using **yarn**:<br/>
`yarn add show-toast-box`<br/><br/>
Or using **CDN**:<br/>
`https://cdn.jsdelivr.net/npm/show-toast-box`

## Features

- Easy to setup ⛏
- Understandable properties.
- Supports RTL for right to left languages like arabic or persian.
- Nice font family for both latin and arabic letters ✏.
- Seven build-in animations support 💥.
- Compatible with [animate.css](https://animate.style/) library.
- All possible placements for the toast container are build-in 🚩 (top left, center, bottom right, ....).
- Ability to add up to two action buttons.
- Loading and Loaded state are available ✅.
- onRemove and onAdd events are exist.
- Can remove all toasts or a specific programmatically.
- Remove when drag is available ✅.
- Pause toast when hover on it.
- There is a progress bar to track the remaining time ⏱.
- The reading time is the default time to hide the toast on auto remove mode.
- Ability to add a description 📃.
- The ability to limit the number of displayed toasts.
- Supports three themes 👚.
- Responsive with all screen sizes 📱.
- Dis/Allow user to remove all toasts.
- More and more!!!

## Quick Start

Before you check the documentation, here's a quick start test:

**---Using class---**

```
import React, { Component } from "react";
import { Toast, ToastWrapper } from "show-toast-box";

class App extends Component {
  constructor(props) {
    super(props);

    // 'ToastWrapper' Reference - Use 'this.wrapper' to access the 'ToastWrapper' class.
    this.wrapper = React.createRef();
  }
  render() {
    return (
      <div className="App">
        <button onClick={() => { this.wrapper.current.add(<Toast title="Wow, It's done ✨" />); }} >Show Toast Box</button>
        <ToastWrapper ref={this.wrapper} />
      </div>
    );
  }
}

export default App;
```

**---Using hooks---**

```
import { useRef } from "react";
import { ToastWrapper, Toast } from "show-toast-box";

export default function App() {
  // 'ToastWrapper' Reference - Use 'wrapper' to access the 'ToastWrapper' class.
  let wrapper = useRef();    

  return (
    <div className="App">
          <button
            onClick={() => { wrapper.current.add(<Toast title="Wow, It's done ✨" />); }}
          >
            Show Toast Box
          </button>
      <ToastWrapper ref={wrapper} limit={5} />
    </div>
  );
}
```