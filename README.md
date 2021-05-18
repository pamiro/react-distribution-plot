# react-distribution-plot

> Distribution plot component

[![NPM](https://img.shields.io/npm/v/react-distribution-plot.svg)](https://www.npmjs.com/package/react-distribution-plot) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![alt text](doc/screenshot.jpg)

## Install

```bash
npm install --save react-distribution-plot
```

## Usage

```jsx
import React, { Component } from 'react'

import DistributionPlotComponent from 'react-distribution-plot'
import 'react-distribution-plot/dist/index.css'

class Example extends Component {
  render() {
    return <DistributionPlotComponent bins={[[0, 1, 1, 0]]} categorical={false} width={800}/>
  }
}
```

## License

MIT © [pamiro](https://github.com/pamiro)
