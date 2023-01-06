import styled from 'styled-components';
import maxBy from 'lodash.maxby';
import { scaleLinear } from 'd3-scale';
import { HoverDataType, YearDataType } from '../Types';

interface Props {
  data: HoverDataType;
}

interface TooltipElProps {
  x: number;
  y: number;
  verticalAlignment: string;
  horizontalAlignment: string;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 200;
  background-color: var(--gray-200);
  border: 1px solid var(--gray-300);
  word-wrap: break-word;
  top: ${(props) => (props.verticalAlignment === 'bottom' ? props.y - 40 : props.y + 40)}px;
  left: ${(props) => (props.horizontalAlignment === 'left' ? props.x - 20 : props.x + 20)}px;
  max-width: 15rem;
  transform: ${(props) => `translate(${props.horizontalAlignment === 'left' ? '-100%' : '0%'},${props.verticalAlignment === 'top' ? '-100%' : '0%'})`};
`;

const TimelineEl = styled.div`
  margin-top: 0.5rem;
`;

interface HighlightedProps {
  isHighlighted: boolean;
}

const Span = styled.span<HighlightedProps>`
  font-weight: ${(props) => (props.isHighlighted ? 'bold' : 'normal')};
  font-style: ${(props) => (props.isHighlighted ? 'normal' : 'italic')};
  color: ${(props) => (props.isHighlighted ? 'var(--blue-600)' : 'var(--gray-700)')};
`;

export const Tooltip = (props: Props) => {
  const { data } = props;
  const graphWidth = 165;
  const height = 75;
  const marginLeft = 20;
  const marginBottom = 10;
  const marginTop = 10;
  const indicatorText = data.indicator === 'bottom40WID' ? 'Income Share of Bottom 40%' : data.indicator === 'top10WID' ? 'Income Share of Top 10%' : 'Ratio of Income Share of Bottom 40% to Top 10%';
  const max = data.data ? maxBy(data.data.data, data.indicator) as YearDataType : 1;
  const arraySize = data.data?.data.length;
  const yScale = scaleLinear().domain([0, max === 1 ? 1 : max[data.indicator]]).range([0, height]).nice();
  const yTicks = yScale.ticks(3);
  return (
    <TooltipEl x={data.xPosition} y={data.yPosition} verticalAlignment={data.yPosition > window.innerHeight / 2 ? 'top' : 'bottom'} horizontalAlignment={data.xPosition > window.innerWidth / 2 ? 'left' : 'right'}>
      <div className='flex-div flex-wrap' style={{ padding: 'var(--spacing-05)', alignItems: 'baseline' }}>
        <h6 className='undp-typography bold margin-bottom-00' style={{ color: 'var(--blue-600)' }}>
          {data.country}
        </h6>
      </div>
      <hr className='undp-style margin-top-00 margin-bottom-00' />
      <div style={{ padding: 'var(--spacing-05) var(--spacing-05) 0 var(--spacing-05)' }}>
        <p className='margin-top-00 margin-bottom-00' style={{ fontSize: '1rem' }}>
          {indicatorText}
          {' '}
          {
            data.data ? (
              <span>
                for
                {' '}
                <span className='bold'>{data.year}</span>
              </span>
            ) : null
          }
          {' '}
          is
          {' '}
          <Span isHighlighted={!!data.data}>
            {
            data.data && data.data.data.findIndex((d) => d.year === data.year) !== -1
              ? data.indicator !== 'b40T10RatioWID'
                ? `${(data.data.data[data.data.data.findIndex((d) => d.year === data.year)][data.indicator] * 100).toFixed(2)}%`
                : data.data.data[data.data.data.findIndex((d) => d.year === data.year)][data.indicator].toFixed(2)
              : 'Not Available'
          }
          </Span>
        </p>
        {
          data.data && arraySize
            ? (
              <TimelineEl>
                <h6 className='undp-typography margin-bottom-00 margin-top-05'>Change Over Time</h6>
                <svg width={graphWidth + marginLeft} height={height + marginBottom + marginTop}>
                  <g>
                    {yTicks.map((d, i) => (
                      <g key={i}>
                        <line
                          x1={0}
                          y1={height - yScale(d) + marginTop}
                          x2={graphWidth + marginLeft}
                          y2={height - yScale(d) + marginTop}
                          stroke='#DDD'
                          strokeWidth={1}
                          strokeDasharray='4 8'
                        />
                        <text
                          x={0}
                          y={height - yScale(d) + marginTop}
                          fontSize='10px'
                          textAnchor='start'
                          dy='3px'
                          fill='#919399'
                        >
                          {data.indicator === 'b40T10RatioWID' ? `${d}` : `${(d * 100)}%`}
                        </text>
                      </g>
                    ))}
                  </g>
                  <g>
                    {
                    data.data.data.map((el, i) => (
                      <rect
                        key={i}
                        width={graphWidth / arraySize - 2}
                        height={yScale(el[data.indicator])}
                        x={(i * (graphWidth / arraySize)) + 1 + marginLeft}
                        y={height - yScale(el[data.indicator]) + marginTop}
                        fill={el.year === data.year ? '#0969FA' : '#DDD'}
                      />
                    ))
                  }
                  </g>
                </svg>
              </TimelineEl>
            ) : null
        }
        {
          data.data && arraySize
            ? (
              <p className='italics small-font margin-top-00'>
                Click to see more details
              </p>
            ) : null
        }
      </div>
    </TooltipEl>
  );
};
