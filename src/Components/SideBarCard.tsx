import { useState } from 'react';
import styled from 'styled-components';
import { InfoIcon } from '../icons';
import { HelpToolTip } from './HelpToolTip';

import '../style/statCardStyle.css';

interface Props {
    title: string;
    titleSubNote?: string;
    tooltip?: boolean;
    value: string;
    // eslint-disable-next-line no-undef
    valueSubNote?: JSX.Element;
}

const CardEl = styled.div`
  @media (max-width: 960px) {
    width: calc(33.33% - 1rem);
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const SideBarCard = (props: Props) => {
  const {
    title,
    tooltip,
    titleSubNote,
    value,
    valueSubNote,
  } = props;

  const [showPopUp, setShowPopUp] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  return (
    <CardEl className='stat-card margin-bottom-05'>
      <h3>
        {value}
      </h3>
      <p>
        {titleSubNote}
        {valueSubNote || null}
      </p>
      <div className='flex-div gap-03 flex-vert-align-center'>
        <h4 className='margin-bottom-00'>
          {title}
        </h4>
        {
          tooltip ? (
            <div
              onMouseEnter={(event) => { setShowPopUp(true); setX(event.clientX); setY(event.clientY); }}
              onMouseLeave={() => { setShowPopUp(false); }}
              style={{ cursor: 'pointer' }}
            >
              <InfoIcon size={16} color='#666666' />
            </div>
          ) : null
        }
      </div>
      {
        showPopUp
          ? (
            <HelpToolTip
              x={x}
              y={y}
              text={(
                <>
                  Income share of bottom 40% by income share of top 10%.
                  {' '}
                  <span className='bold'>
                    Values lower than 1 imply higher T10 income shares and lower B40 income shares.
                  </span>
                </>
              )}
            />
          ) : null
      }
    </CardEl>
  );
};
