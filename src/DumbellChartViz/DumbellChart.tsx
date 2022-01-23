import styled from 'styled-components';
import sortBy from 'lodash.sortby';
import { scaleLinear } from 'd3-scale';
import { DataType } from '../Types';

interface Props {
  data: DataType[];
  year: number;
  sortedBy: string;
}

const LegendContainerEl = styled.div`
  display: flex;
  margin: 2rem 0 0 0;
`;

const LegendEl = styled.div`
  display: flex;
  margin-right: 2rem;
  align-items: center;
  font-size: 1.6rem;
  color: var(--navy);
`;

interface LegendColorProps {
  color: string;
}

const LegendColor = styled.div<LegendColorProps>`
  background-color: ${(props) => props.color};
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  margin-right: 0.5rem;
`;

export const DumbellChart = (props: Props) => {
  const { data, year, sortedBy } = props;
  const graphWidth = 1280;
  const leftPadding = 230;
  const rowHeight = 35;
  const marginTop = 15;
  const formattedData = data.map((d) => {
    if (d.data.findIndex((el) => el.year === year) !== -1) {
      return ({
        country: d.country,
        top10WID: d.data[d.data.findIndex((el) => el.year === year)].top10WID,
        bottom40WID: d.data[d.data.findIndex((el) => el.year === year)].bottom40WID,
        diff: d.data[d.data.findIndex((el) => el.year === year)].top10WID - d.data[d.data.findIndex((el) => el.year === year)].bottom40WID,
      });
    }
    return null;
  });
  const sortedData = sortBy(formattedData, sortedBy);
  const xPos = scaleLinear().domain([0, 1]).range([0, graphWidth - leftPadding]).nice();
  return (
    <>
      <LegendContainerEl>
        <LegendEl>
          <LegendColor color='#E26B8D' />
          <div>Bottom 40%</div>
        </LegendEl>
        <LegendEl>
          <LegendColor color='#266291' />
          <div>Top 10%</div>
        </LegendEl>
      </LegendContainerEl>
      <svg style={{ width: '100%' }} viewBox={`0 0 ${graphWidth} ${(formattedData.length * rowHeight) + marginTop}`}>
        {
          sortedData.map((d, i) => (
            d
              ? (
                <g
                  key={i}
                  transform={`translate(0,${marginTop + (i * rowHeight)})`}
                >
                  <text
                    x={0}
                    y={rowHeight / 2}
                    dy='3px'
                    fontSize='14px'
                    color='#110848'
                  >
                    {d.country}
                  </text>
                  <line
                    x1={leftPadding}
                    x2={graphWidth}
                    y1={rowHeight / 2}
                    y2={rowHeight / 2}
                    stroke='#AAA'
                    strokeWidth={1}
                    strokeDasharray='4 8'
                    shapeRendering='crispEdge'
                  />
                  <line
                    x1={xPos(d.bottom40WID) + leftPadding}
                    x2={xPos(d.top10WID) + leftPadding}
                    y1={rowHeight / 2}
                    y2={rowHeight / 2}
                    stroke='#110848'
                    strokeWidth={1}
                    shapeRendering='crispEdge'
                  />
                  <circle
                    cx={xPos(d.bottom40WID) + leftPadding}
                    cy={rowHeight / 2}
                    r={7}
                    fill='#E26B8D'
                  />
                  <text
                    x={xPos(d.bottom40WID) + leftPadding}
                    y={0}
                    dy='7px'
                    fontSize='10px'
                    fill='#E26B8D'
                    textAnchor='middle'
                  >
                    {(d.bottom40WID * 100).toFixed(2)}
                    %
                  </text>
                  <circle
                    cx={xPos(d.top10WID) + leftPadding}
                    cy={rowHeight / 2}
                    r={7}
                    fill='#266291'
                  />
                  <text
                    x={xPos(d.top10WID) + leftPadding}
                    y={0}
                    dy='7px'
                    fontSize='10px'
                    fill='#266291'
                    textAnchor='middle'
                  >
                    {(d.top10WID * 100).toFixed(2)}
                    %
                  </text>
                </g>
              ) : null
          ))
        }

      </svg>
    </>
  );
};
