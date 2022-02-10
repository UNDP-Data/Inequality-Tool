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
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 10000;
  border-radius: 1rem;
  font-size: 1.4rem;
  background-color: var(--white);
  box-shadow: var(--shadow);
  word-wrap: break-word;
  top: ${(props) => props.y - 40}px;
  left: ${(props) => props.x + 20}px;
  width: 20rem;
`;

const TooltipTitle = styled.div`
  color: var(--white);  
  background: var(--blue-medium);
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  position: relative;
  font-weight: 700;
  font-size: 2rem;
  line-height: 2.4rem;
  border-radius: 1rem 1rem 0 0;
`;

const TooltipBody = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  font-weight: normal;
  font-size: 1.4rem;
  line-height: 2rem;
  color: var(--black);
`;

const TooltipHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TimelineEl = styled.div`
  margin-top: 0.5rem;
`;

const TimelineElTitle = styled.div`
  font-size: 1.4rem;
  color: var(--black-700);
  font-weight: bold;
`;

interface HighlightedProps {
  isHighlighted: boolean;
}

const Span = styled.span<HighlightedProps>`
  font-weight: ${(props) => (props.isHighlighted ? 'bold' : 'normal')};
  font-style: ${(props) => (props.isHighlighted ? 'normal' : 'italic')};
  color: ${(props) => (props.isHighlighted ? 'var(--primary-blue)' : 'var(--black-700)')};
`;

const SubNote = styled.div`
  font-style: italic;
  color: var(--black-550);
`;

export const Tooltip = (props: Props) => {
  const { data } = props;
  const graphWidth = 125;
  const height = 50;
  const marginLeft = 20;
  const marginBottom = 10;
  const marginTop = 10;
  const indicatorText = data.indicator === 'bottom40WID' ? 'Income Share of Bottom 40%' : data.indicator === 'top10WID' ? 'Income Share of Top 10%' : 'Ratio of Income Share of Bottom 40% to Top 10%';
  const max = data.data ? maxBy(data.data.data, data.indicator) as YearDataType : 1;
  const arraySize = data.data?.data.length;
  const yScale = scaleLinear().domain([0, max === 1 ? 1 : max[data.indicator]]).range([0, height]).nice();
  const yTicks = yScale.ticks(3);
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 240 : data.xPosition} y={data.yPosition}>
      <TooltipHead>
        <TooltipTitle>
          {data.country}
        </TooltipTitle>
      </TooltipHead>
      <TooltipBody>
        <div>
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
        </div>
        {
          data.data && arraySize
            ? (
              <TimelineEl>
                <TimelineElTitle>Change Over Time</TimelineElTitle>
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
              <SubNote>
                Click to see more details
              </SubNote>
            ) : null
        }
      </TooltipBody>
    </TooltipEl>
  );
};
