import styled from 'styled-components';
import { DataType } from '../Types';

interface Props {
    title: string;
    data: DataType[];
    year: number;
}

const CardEl = styled.div`
  border-radius: 5px;
  box-shadow: var(--shadow);
  @media (max-width: 960px) {
    display: none;
  }
  @media (max-width: 800px) {
    width: 100%;
    display: inline;
  }
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
  padding: 0 1rem;
`;

export const SideBarCardTable = (props: Props) => {
  const {
    title,
    data,
    year,
  } = props;

  return (
    <CardEl>
      <CardTitleEl>
        {title}
      </CardTitleEl>
      <CardBodyEl>
        {data.map((d) => (
          <RowEl>
            <div className='bold'>
              {d.country}
            </div>
            <div>
              {d.data[d.data.findIndex((el) => el.year === year)].b40T10RatioWID.toFixed(3)}
            </div>
          </RowEl>
        ))}
      </CardBodyEl>
    </CardEl>
  );
};
