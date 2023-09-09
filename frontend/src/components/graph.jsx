import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import SelectMenu from './select';
import { Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { handleCustomData, handleInstrumentalData, handleMatrixData } from '../lib/utilities';



const MusicGraph = ({ data }) => {
  
    const navigate = useNavigate();

    const heatmaps = [{x: 'offset', y: 'pitch'}]
    const vertical = ["pitch","dynamic","articulation"]
    const graphTypes = [{ type: 'scatter', mode: 'lines'}, {type: 'histogram'}, {type:'bar'}, {type: 'heatmap'}]

    const graphs = {
      instrumentData: () => handleInstrumentalData(data, axisAndGraph),
      customData: () => handleCustomData(data, axisAndGraph),
      heatmap: () => handleMatrixData(data)
    }

    const [ fields ] = useState(Object.keys(data[0]).map(item => { return { name: item, ...(vertical.includes(item) ? { type: 'y' } : { type: 'x' }) } }));
    const [ axisAndGraph, setAxisAndGraph ] = useState({x: 'offset', y: 'pitch', graphType: graphTypes[0], applyOnAllInstruments: false })
    const [ toCompare, setCompare ] = useState(axisAndGraph)
    const [ viewedGraphKey, setGraphKey ] = useState({ current: 'instrumentData', next: ''})
    const [ isHeatmapApplicable, setHeatmapApplicable ] = useState(true)
    const [ graphData,setGraph ] = useState(graphs[viewedGraphKey.current])

    useEffect(()=> {
      let _mounted = true 
      if (!data.length) return navigate('/')
      return () => _mounted = false;
    },[])

    useEffect(()=> {
      if (toCompare.graphType.type==='heatmap') return setHeatmapApplicable(false)
      const search = { 
        x: toCompare.x,
        y: toCompare.y
      }
      setHeatmapApplicable(heatmaps.some(item => item.x === search.x && item.y === search.y));
    },[toCompare.graphType, isHeatmapApplicable])

    useEffect(()=>{
      setGraph(graphs[viewedGraphKey.current])
    },[viewedGraphKey,isHeatmapApplicable,viewedGraphKey])


    const handleComparison = (e,field) => {
      let value;
      if (field==='graphType') value = graphTypes.find(item => item.type === e.target.value)
      else value = e.target.value
      setCompare(prevState => { return {...prevState, [field]: value}})
  }

    const onHandleCompare = async (type,key) => {
      await new Promise((res,rej)=> res(setAxisAndGraph(toCompare)));
      await new Promise((res,rej) => res(setGraphKey(prev =>( {current: prev.next, next: '' }))));
    }


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
              isHeatmapApplicable={isHeatmapApplicable}
              handleCompare={onHandleCompare}
              handleComparison={handleComparison}
              comparedData={toCompare}
              setNextGraphKey={setGraphKey}
            />
            <Plot 
              data={graphData}
              layout={layout}
            />
          </>
          :
          <Spinner variant="light" size="lg"/>
        }
        </Container>
    )
}

export default MusicGraph