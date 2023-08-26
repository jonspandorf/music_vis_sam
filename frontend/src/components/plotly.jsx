import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import SelectMenu from './select';
import { Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



const MusicGraph = ({ data }) => {
  
    const navigate = useNavigate();

    const vertical = ["pitch","dynamic","articulation"]
    const graphTypes = [{ type: 'scatter', mode: 'lines'}, {type: 'histogram'}, {type:'bar'}, {type: 'heatmap'}]
    const [ fields ] = useState(Object.keys(data[0]).map(item => { return { name: item, ...(vertical.includes(item) ? { type: 'y' } : { type: 'x' }) } }));
    const [ axisAndGraph, setAxisAndGraph ] = useState({x: 'offset', y: 'pitch', graphType: graphTypes[0], applyOnAllInstruments: false})
    const [ toCompare, setCompare ] = useState(axisAndGraph)
    const [ graphData, setGraphData ] = useState([])

    useEffect(()=> {
      let _mounted = true 
      if (!data.length) return navigate('/')
      return () => _mounted = false;
    },[])

    useEffect(()=> {},[toCompare])

    const onHandleCompare = async (type) => {
      await new Promise((res,rej)=> res(setAxisAndGraph(toCompare)));
      setGraphData(dataTypes[type])
    }

    const instruments = [...new Set(data.map((item) => item.instrument))];
    const offsets = [... new Set(data.map(item => item.offset))].sort((a,b) => a - b)
    const instrumentData = instruments.map((instrument) => ({
        name: instrument,
        x: data.filter((item) => item.instrument === instrument).map((item) => item[axisAndGraph.x]),
        y: data.filter((item) => item.instrument === instrument).map((item) => item[axisAndGraph.y]),
        type: axisAndGraph.graphType.type,
        ...(axisAndGraph.graphType.mode && { mode: axisAndGraph.graphType.mode })
      }));

    const orchestralData = [{
      x: data.map(item => item[axisAndGraph.x]),
      y: data.map(item => item[axisAndGraph.y]),
      type: axisAndGraph.graphType.type,
        ...(axisAndGraph.graphType.mode && { mode: axisAndGraph.graphType.mode })
}]

    const matrix = instruments.map(instrument =>
      offsets.map(offset => {
          const matchingData = data.find(item =>
              item.instrument === instrument && item.offset === offset
          );
          return matchingData ? matchingData.pitch : NaN;
      })
    );

    const heatMap = [{
      x: offsets,
      y: instruments,
      z: matrix,
      type: 'heatmap',
      colorscale: 'Viridis'
    }]

      const layout = {
        title: 'Musical Data Plot',
        xaxis: {
          title: axisAndGraph.x.toUpperCase(),
        },
        yaxis: {
          title: axisAndGraph.y.toUpperCase(),
        },
      };

      
    const dataTypes = {
      instrumentData,
      orchestralData,
      heatMap 
    }

    console.log(graphData)

    return (
        <Container>
        {
          data.length ? 
          <>
            <SelectMenu 
              graphTypes={graphTypes} 
              fields={fields} 
              setCompare={setCompare} 
              isHeatmap={toCompare.graphType.type==='heatmap'}
              handleCompare={onHandleCompare}
              comparedData={toCompare}
            />
            <Plot data={graphData.length ? graphData : heatMap} layout={layout}/>
          </>
          :
          <Spinner variant="light" size="lg"/>
        }
        </Container>
    )
}

export default MusicGraph