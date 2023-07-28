import React from 'react';
import Plot from 'react-plotly.js';

const MusicGraph = ({ data }) => {

    const instruments = [...new Set(data.map((item) => item.instrument))];
    const instrumentData = instruments.map((instrument) => ({
        name: instrument,
        x: data.filter((item) => item.instrument === instrument).map((item) => item.offset),
        y: data.filter((item) => item.instrument === instrument).map((item) => item.pitch),
        mode: 'lines', 
        type: 'scatter',
      }));

      const layout = {
        title: 'Musical Data Plot',
        xaxis: {
          title: 'Offset',
        },
        yaxis: {
          title: 'Pitch',
        },
      };
    return (
        <>

            <Plot data={instrumentData} layout={layout}/>

        </>
    )
}

export default MusicGraph