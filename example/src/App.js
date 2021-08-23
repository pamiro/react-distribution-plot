import React from 'react'

import { DistributionPlotComponent } from 'react-distribution-plot'
import 'react-distribution-plot/dist/index.css'


const App = () => {

  let dist = [];
  const n = 10;
  const min = 0;
  const max = 1.0
  const step = (max - min) / n
  let j = min
  while( j <= (max-step)) {
    const p = j+step/2
    dist.push([j, j+step, 1/n, Math.log(p/(1-p))])
    j += step
  }
  return <DistributionPlotComponent categorical={false} bins={dist} callback={ (bins) => {console.debug(bins)}}/>
}

export default App
