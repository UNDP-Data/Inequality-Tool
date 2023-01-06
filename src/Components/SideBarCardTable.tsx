import { useContext } from 'react';
import styled from 'styled-components';
import Context from '../Context/Context';
import { CtxDataType, DataType } from '../Types';

interface Props {
    title: string;
    data: DataType[];
    titleSubNote: string;
}

const CardTitleEl = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  text-align: center;
  background-color: var(--gray-300);
  padding: 0.5rem;
  position: sticky;
  top: 0;
  @media (max-width: 960px) {
    font-size: 1.2rem;
  }
`;

const CardBodyEl = styled.div`
  font-size: 1rem;
  padding: 0.5rem 0;
  background-color: var(--gray-100);
`;

const RowEl = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: var(--black-100);
  }
`;

const LeftEl = styled.div`
  display: flex;
`;

const IndexEl = styled.div`
  width: 1.25rem;
  margin-right: 0.75rem;
`;

const Span = styled.span`
  font-size: 0.75rem;
  text-transform: none;
  font-weight: normal;
  font-style: italic;
`;

export const SideBarCardTable = (props: Props) => {
  const {
    title,
    data,
    titleSubNote,
  } = props;

  const {
    Year,
    Indicator,
    updateCountry,
    updateISO3,
  } = useContext(Context) as CtxDataType;
  return (
    <div style={{ maxHeight: '18.75rem', overflow: 'auto' }} className='undp-scrollbar'>
      <CardTitleEl>
        {title}
        {' '}
        <Span>{titleSubNote}</Span>
      </CardTitleEl>
      <CardBodyEl>
        {data.reverse().map((d, i) => (
          <RowEl
            key={i}
            onClick={() => { updateCountry(d.country); updateISO3(d.ISOAlpha3); }}
          >
            <LeftEl>
              <IndexEl>
                {i + 1}
              </IndexEl>
              <div className='bold'>
                {d.country}
              </div>
            </LeftEl>
            <div>
              {Indicator === 'b40T10RatioWID' ? d.data[d.data.findIndex((el) => el.year === Year)].b40T10RatioWID.toFixed(3) : `${(d.data[d.data.findIndex((el) => el.year === Year)][Indicator] * 100).toFixed(2)}%`}
            </div>
          </RowEl>
        ))}
      </CardBodyEl>
    </div>
  );
};
