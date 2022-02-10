import { useState } from 'react';
import styled from 'styled-components';
import { InfoIcon } from '../icons';
import { HelpToolTip } from './HelpToolTip';

interface Props {
    title: string;
    titleSubNote?: string;
    tooltip?: boolean;
    value: string;
    // eslint-disable-next-line no-undef
    valueSubNote?: JSX.Element;
}

const CardEl = styled.div`
  border-radius: 5px;
  box-shadow: var(--shadow);
  margin-bottom: 1rem;
  @media (max-width: 960px) {
    width: calc(33.33% - 1rem);
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const CardTitleEl = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  color: var(--blue-medium);
  background-color: var(--blue-very-light);
  padding: 0.75rem 0.5rem;
  line-height: 1.6rem;
  @media (max-width: 960px) {
  font-size: 1.2rem;
  }
`;

const CardBodyEl = styled.div`
  font-size: 2.8rem;
  padding: 1.5rem 1rem 1rem 1rem;
  font-weight: bold;
  text-transform: uppercase;
  line-height: 2.4rem;
  text-align: center;
  color: var(--primary-blue);
  background-color: var(--white);
`;

const SubNote = styled.span`
  font-size: 1.2rem;
  text-transform: none;
  font-weight: normal;
  font-style: italic;
  color: var(--black-550);
  @media (max-width: 960px) {
    font-size: 1rem;
  }
`;

const ValueSubNoteSpan = styled.div`
  font-size: 1.3rem;
  line-height: 1.6rem;
  text-transform: none;
  font-weight: normal;
  color: var(--black-550);
  margin-top: 1rem;
`;

const TitleEl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconEl = styled.div`
  height: 18px;
  margin-left: 5px;
  cursor: pointer;
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
    <CardEl>
      <CardTitleEl>
        <TitleEl>
          {title}
          {
            tooltip ? (
              <IconEl
                onMouseEnter={(event) => { setShowPopUp(true); setX(event.clientX); setY(event.clientY); }}
                onMouseLeave={() => { setShowPopUp(false); }}
              >
                <InfoIcon size={16} color='#666666' />
              </IconEl>
            ) : null
          }

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
        </TitleEl>
        <SubNote>
          {titleSubNote}
        </SubNote>
      </CardTitleEl>
      <CardBodyEl>
        {value}
        {valueSubNote ? <ValueSubNoteSpan>{valueSubNote}</ValueSubNoteSpan> : null}
      </CardBodyEl>
    </CardEl>
  );
};
