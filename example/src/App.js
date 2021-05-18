import React from 'react'

import { DistributionPlotComponent } from 'react-distribution-plot'
import 'react-distribution-plot/dist/index.css'


const App = () => {
  return <DistributionPlotComponent callback={ (bins) => {console.debug(bins)}}/>
}

export default App
