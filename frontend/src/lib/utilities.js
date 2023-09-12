

export const handleInstrumentalData = (data, axisAndGraph) => {

    const instruments = [...new Set(data.map((item) => item.instrument))];

    return instruments.map((instrument) => ({
        name: instrument,
        x: data.filter((item) => item.instrument === instrument).map((item) => item[axisAndGraph.y] ? item[axisAndGraph.x] : NaN),
        y: data.filter((item) => item.instrument === instrument).map((item) => item[axisAndGraph.y] ? item[axisAndGraph.y] : NaN),
        type: axisAndGraph.graphType.type,
        ...(axisAndGraph.graphType.mode && { mode: axisAndGraph.graphType.mode })
      }));

}

export const handleCustomData = (data,axisAndGraph) => {

    return [{
        x: data.map(item => item[axisAndGraph.x]),
        y: data.map(item => item[axisAndGraph.y]),
        type: axisAndGraph.graphType.type,
          ...(axisAndGraph.graphType.mode && { mode: axisAndGraph.graphType.mode })
      }]
}

export const handleMatrixData = (data) => {

    const instruments = [...new Set(data.map((item) => item.instrument))].reverse();
    const offsets = [...new Set(data.map(item => item.offset))].sort((a,b) => a - b)

    const matrix = instruments.map(instrument =>
        offsets.map(offset => {
            const matchingData = data.find(item =>
                item.instrument === instrument && item.offset === offset
            );
            return matchingData ? matchingData.pitch : NaN;
        })
      );

    return [{
        x: offsets,
        y: instruments,
        z: matrix,
        type: 'heatmap',
        colorscale: 'Viridis'
      }]

}