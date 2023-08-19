import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import SelectMenu from './select';
import { Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



const MusicGraph = ({ data }) => {
  
    const navigate = useNavigate();

    const vertical = ["pitch","dynamic","articulation"]
    const graphTypes = [{ type: 'scatter', mode: 'lines'}, {type: 'histogram'}, {type:'bar'}]
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

    const instruments = [...new Set(data.map((item) => item.instrument))];
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

    console.log(orchestralData)
      const layout = {
        title: 'Musical Data Plot',
        xaxis: {
          title: axisAndGraph.x.toUpperCase(),
        },
        yaxis: {
          title: axisAndGraph.y.toUpperCase(),
        },
      };
    return (
        <Container>
        {
          data.length ? 
          <>
            <SelectMenu 
              graphTypes={graphTypes} 
              fields={fields} 
              setCompare={setCompare} 
              handleCompare={()=>setAxisAndGraph(toCompare)}
            />
            <Plot data={axisAndGraph.applyOnAllInstruments ? orchestralData : instrumentData} layout={layout}/>
          </>
          :
          <Spinner variant="light" size="lg"/>
        }
        </Container>
    )
}

export default MusicGraph