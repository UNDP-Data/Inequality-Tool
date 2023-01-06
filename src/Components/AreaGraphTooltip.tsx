import styled from 'styled-components';
import { AreaGraphHoverDataType } from '../Types';

interface Props {
  data: AreaGraphHoverDataType;
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

interface RowElProps {
  color?: string;
}

const RowEl = styled.div<RowElProps>`
  display: flex;
  justify-content: space-between;
  margin: 0.875rem 0;
  font-size: 0.875rem;
  color: ${(props) => (props.color ? props.color : 'var(--navy)')};
  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const Tooltip = (props: Props) => {
  const { data } = props;
  return (
    <TooltipEl x={data.xPosition} y={data.yPosition} verticalAlignment={data.yPosition > window.innerHeight / 2 ? 'top' : 'bottom'} horizontalAlignment={data.xPosition > window.innerWidth / 2 ? 'left' : 'right'}>
      <div className='flex-div flex-wrap' style={{ padding: 'var(--spacing-05)', alignItems: 'baseline' }}>
        <h6 className='undp-typography bold margin-bottom-00' style={{ color: 'var(--blue-600)' }}>
          {data.country}
        </h6>
      </div>
      <hr className='undp-style margin-top-00 margin-bottom-00' />
      <div style={{ padding: 'var(--spacing-05)' }}>
        <p style={{ fontSize: '0.875rem', margin: 0 }}>
          Income Share For
          {' '}
          <span className='bold'>{data.year}</span>
        </p>
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
      </div>
    </TooltipEl>
  );
};
