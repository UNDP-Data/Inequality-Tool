import styled from 'styled-components';
import { AreaGraphHoverDataType } from '../Types';

interface Props {
  data: AreaGraphHoverDataType;
}

interface TooltipElProps {
  x: number;
  y: number;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 10;
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
  color: var(--navy);  
  background: var(--yellow);
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  position: relative;
  font-weight: 700;
  font-size: 1.6rem;
  line-height: 2.4rem;
`;

const TooltipBody = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  font-size: 1.4rem;
  line-height: 2rem;
  color: var(--grey);
`;

const TooltipHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface RowElProps {
  color?: string;
}

const RowEl = styled.div<RowElProps>`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  color: ${(props) => (props.color ? props.color : 'var(--navy)')};
  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const Tooltip = (props: Props) => {
  const { data } = props;
  return (
    <TooltipEl x={data.xPosition > window.innerWidth / 2 ? data.xPosition - 240 : data.xPosition} y={data.yPosition}>
      <TooltipHead>
        <TooltipTitle>
          {data.country}
        </TooltipTitle>
      </TooltipHead>
      <TooltipBody>
        <div>
          Wealth Share For
          {' '}
          <span className='bold'>{data.year}</span>
        </div>
        <RowEl color='#266291'>
          <div>Top 10%</div>
          <div className='bold'>
            {(data.top10WID * 100).toFixed(2)}
            %
          </div>
        </RowEl>
        <RowEl color='#E26B8D'>
          <div>Bottom 40%</div>
          <div className='bold'>
            {(data.bottom40WID * 100).toFixed(2)}
            %
          </div>
        </RowEl>
        <RowEl>
          <div>Difference</div>
          <div className='bold'>
            {((data.top10WID - data.bottom40WID) * 100).toFixed(2)}
            %
          </div>
        </RowEl>
      </TooltipBody>
    </TooltipEl>
  );
};
