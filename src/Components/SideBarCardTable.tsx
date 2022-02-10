import { useContext } from 'react';
import styled from 'styled-components';
import Context from '../Context/Context';
import { CtxDataType, DataType } from '../Types';

interface Props {
    title: string;
    data: DataType[];
    titleSubNote: string;
}

const CardEl = styled.div`
  border-radius: 5px;
  box-shadow: var(--shadow);
  max-height: 30rem;
  overflow: auto;
`;

const CardTitleEl = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  color: var(--blue-medium);
  background-color: var(--blue-very-light);
  padding: 0.75rem 0.5rem;
  line-height: 1.6rem;
  position:sticky;
  top: 0;
  @media (max-width: 960px) {
    font-size: 1.2rem;
  }
`;

const CardBodyEl = styled.div`
  font-size: 1.4rem;
  line-height: 2rem;
  padding: 1.5rem 0;
  color: var(--black);
  background-color: var(--white);
`;

const RowEl = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: var(--black-100);
  }
`;

const LeftEl = styled.div`
  display: flex;
`;

const IndexEl = styled.div`
  width: 2rem;
  margin-right: 1rem;
`;

const Span = styled.span`
  font-size: 1.2rem;
  color: var(--black-550);
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
    <CardEl>
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
    </CardEl>
  );
};
