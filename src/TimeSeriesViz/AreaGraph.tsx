import { useState } from 'react';
import styled from 'styled-components';
import { area, line, curveCardinal } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { DataType, AreaGraphHoverDataType } from '../Types';
import { Tooltip } from '../Components/AreaGraphTooltip';

interface Props {
  data: DataType;
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

export const AreaGraph = (props: Props) => {
  const { data } = props;
  const graphWidth = 1270;
  const graphHeight = 320;
  const marginLeft = 5;
  const marginRight = 5;
  const marginTop = 15;
  const marginBottom = 20;
  const [hoverData, setHoverData] = useState<AreaGraphHoverDataType | undefined>(undefined);

  const max = maxBy(data.data, 'top10WID');
  const maxYear = maxBy(data.data, 'year');
  const minYear = minBy(data.data, 'year');
  const x = scaleLinear().domain([minYear?.year as number, maxYear?.year as number]).range([marginLeft, graphWidth]);
  const y = scaleLinear().domain([0, max?.top10WID as number]).range([graphHeight, marginTop]).nice();
  const areaShape = area()
    .x((d: any) => x(d.year))
    .y1((d: any) => y(d.top10WID))
    .y0((d: any) => y(d.bottom40WID))
    .curve(curveCardinal.tension(0.2));
  const lineShapeB40 = line()
    .x((d: any) => x(d.year))
    .y((d: any) => y(d.bottom40WID))
    .curve(curveCardinal.tension(0.2));
  const lineShapeT10 = line()
    .x((d: any) => x(d.year))
    .y((d: any) => y(d.top10WID))
    .curve(curveCardinal.tension(0.2));
  const yTicks = y.ticks(5);
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
      <svg style={{ width: '100%' }} viewBox={`0 0 ${graphWidth + marginLeft + marginRight} ${graphHeight + marginTop + marginBottom}`}>
        <g>
          <path d={areaShape(data.data as any) as string} fill='#0969FA' opacity={0.05} />
          <path d={lineShapeB40(data.data as any) as string} fill='none' stroke='#E26B8D' strokeWidth={2} shapeRendering='geometricPrecision' />
          <path d={lineShapeT10(data.data as any) as string} fill='none' stroke='#266291' strokeWidth={2} shapeRendering='geometricPrecision' />
        </g>
        {
          hoverData ? <line x1={x(hoverData.year)} x2={x(hoverData.year)} y1={y(0)} y2={marginTop} stroke='#212121' fill='none' /> : null
        }
        <g>
          {
            data.data.map((d, i) => (
              <g key={i}>
                <circle
                  cx={x(d.year)}
                  cy={y(d.bottom40WID)}
                  r={5}
                  fill='#E26B8D'
                  onMouseEnter={(event) => {
                    setHoverData({
                      country: data.country,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                      year: d.year,
                      top10WID: d.top10WID,
                      bottom40WID: d.bottom40WID,
                    });
                  }}
                  onMouseMove={(event) => {
                    setHoverData({
                      country: data.country,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                      year: d.year,
                      top10WID: d.top10WID,
                      bottom40WID: d.bottom40WID,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoverData(undefined);
                  }}
                />
                <circle
                  cx={x(d.year)}
                  cy={y(d.top10WID)}
                  r={5}
                  fill='#266291'
                  onMouseEnter={(event) => {
                    setHoverData({
                      country: data.country,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                      year: d.year,
                      top10WID: d.top10WID,
                      bottom40WID: d.bottom40WID,
                    });
                  }}
                  onMouseMove={(event) => {
                    setHoverData({
                      country: data.country,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                      year: d.year,
                      top10WID: d.top10WID,
                      bottom40WID: d.bottom40WID,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoverData(undefined);
                  }}
                />
              </g>
            ))
          }
        </g>
        <g>
          {yTicks.map((d, i) => (
            <g key={i}>
              <line
                x1={marginLeft}
                y1={y(d)}
                x2={graphWidth}
                y2={y(d)}
                stroke='#AAA'
                strokeWidth={1}
                opacity={d === 0 ? 0 : 1}
                strokeDasharray='4 8'
                shapeRendering='crispEdge'
              />
              <text
                x={marginLeft}
                y={y(d)}
                fontSize='10px'
                textAnchor='start'
                dy='-5px'
                fill='#919399'
              >
                {(d * 100)}
                %
              </text>
            </g>
          ))}
        </g>
        <g>
          <line
            x1={marginLeft}
            y1={y(0)}
            x2={graphWidth}
            y2={y(0)}
            stroke='#212121'
            strokeWidth={1}
            shapeRendering='crispEdge'
          />
          {data.data.map((d, i) => (
            <text
              key={i}
              y={graphHeight + marginBottom + marginTop}
              x={x(d.year)}
              fontSize='10px'
              textAnchor={i === 0 ? 'start' : i === data.data.length - 1 ? 'end' : 'middle'}
              dy='-15px'
              fill='#212121'
            >
              {d.year}
            </text>
          ))}
        </g>
      </svg>
      {
        hoverData
          ? (
            <Tooltip
              data={hoverData}
            />
          )
          : null
      }
    </>
  );
};
