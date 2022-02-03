import styled from 'styled-components';
import { CountrySideBar } from './CountrySideBar';
import { WorldSideBar } from './WorldSideBar';
import { DataType } from '../Types';

interface Props {
  year: number;
  data: DataType[];
  country: string;
  ISO3: string;
}

const El = styled.div`
  padding:0 1rem;
  font-size: 1.6rem;
  font-weight: normal;
  color: var(--black);
  border-top: 1px solid var(--grey-c3);
  margin-top: 0.5rem;
`;

export const SideBarBody = (props: Props) => {
  const {
    year,
    data,
    country,
    ISO3,
  } = props;
  return (
    <El>
      {
        country === 'World'
          ? <WorldSideBar year={year} data={data} />
          : data.findIndex((d) => d.ISOAlpha3 === ISO3) !== -1
            ? <CountrySideBar year={year} data={data} iso3={ISO3} />
            : (
              <>
                Data for
                {' '}
                {country}
                {' '}
                is not available
              </>
            )
      }
    </El>
  );
};
