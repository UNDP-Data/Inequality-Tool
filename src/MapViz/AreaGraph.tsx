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
  fullScreen?: boolean;
}

interface LegendColorProps {
  color: string;
}

const LegendColor = styled.div<LegendColorProps>`
  background-color: ${(props) => props.color};
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 1rem;
`;

export const AreaGraph = (props: Props) => {
  const { data, fullScreen } = props;
  const graphWidth = fullScreen ? 960 : 294;
  const graphHeight = fullScreen ? 215 : 150;
  const marginLeft = 3;
  const marginRight = 3;
  const marginTop = 15;
  const marginBottom = 0;
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
  const yTicks = y.ticks(3);
  return (
    <>
      <h6 className='undp-typography margin-top-07 flex-vert-align-center'>Change Over Time</h6>
      <div className='flex-div flex-wrap gap-05 flex-vert-align-center'>
        <div className='flex-div gap-02 flex-vert-align-center'>
          <LegendColor color='#E26B8D' />
          <p style={{ fontSize: '0.875rem', margin: 0 }}>Bottom 40%</p>
        </div>
        <div className='flex-div gap-02 flex-vert-align-center'>
          <LegendColor color='#266291' />
          <p style={{ fontSize: '0.875rem', margin: 0 }}>Top 10%</p>
        </div>
      </div>
      <svg style={{ width: '100%' }} viewBox={`0 0 ${graphWidth + marginLeft + marginRight} ${graphHeight + marginTop + marginBottom}`}>
        <g>
          <path d={areaShape(data.data as any) as string} fill='#0969FA' opacity={0.05} />
          <path d={lineShapeB40(data.data as any) as string} fill='none' stroke='#E26B8D' strokeWidth={2} />
          <path d={lineShapeT10(data.data as any) as string} fill='none' stroke='#266291' strokeWidth={2} />
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
                  r={3}
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
                  r={3}
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
                <rect
                  x={x(d.year) - 3}
                  y={0}
                  width={6}
                  height={graphHeight}
                  r={3}
                  fill='#266291'
                  opacity={0}
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
          <text
            y={graphHeight + marginBottom + marginTop}
            x={x(minYear?.year as number)}
            fontSize='10px'
            textAnchor='start'
            dy='0px'
            fill='#212121'
          >
            {minYear?.year}
          </text>
          <text
            y={graphHeight + marginBottom + marginTop}
            x={x(maxYear?.year as number)}
            fontSize='10px'
            textAnchor='end'
            dy='0px'
            fill='#212121'
          >
            {maxYear?.year}
          </text>
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
