import styled from 'styled-components';
import { useContext } from 'react';
import { CountrySideBar } from './CountrySideBar';
import { WorldSideBar } from './WorldSideBar';
import { CtxDataType, DataType } from '../Types';
import Context from '../Context/Context';

interface Props {
  data: DataType[];
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
    data,
  } = props;
  const {
    Country,
    ISO3,
  } = useContext(Context) as CtxDataType;
  return (
    <El>
      {
        Country === 'World'
          ? <WorldSideBar data={data} />
          : data.findIndex((d) => d.ISOAlpha3 === ISO3) !== -1
            ? <CountrySideBar data={data} />
            : (
              <>
                Data for
                {' '}
                {Country}
                {' '}
                is not available
              </>
            )
      }
    </El>
  );
};
