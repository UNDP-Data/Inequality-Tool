import styled from 'styled-components';
import { DataType } from '../Types';

interface Props {
    title: string;
    data: DataType[];
    year: number;
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
  text-transform: uppercase;
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
  line-height: 3.5rem;
  padding: 1.5rem 0;
  color: var(--black);
  background-color: var(--white);
`;

const RowEl = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
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
    year,
    titleSubNote,
  } = props;

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
              {d.data[d.data.findIndex((el) => el.year === year)].b40T10RatioWID.toFixed(3)}
            </div>
          </RowEl>
        ))}
      </CardBodyEl>
    </CardEl>
  );
};
