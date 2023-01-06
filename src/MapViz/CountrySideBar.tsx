import styled from 'styled-components';
import { useContext } from 'react';
import { AreaGraph } from './AreaGraph';
import { CtxDataType, DataType } from '../Types';
import Context from '../Context/Context';

interface Props {
  data: DataType[];
}

const AreaGraphEl = styled.div`
  @media (max-width: 960px) {
    display: none;
  }
`;

export const CountrySideBar = (props: Props) => {
  const {
    data,
  } = props;
  const {
    ISO3,
  } = useContext(Context) as CtxDataType;
  const countryIndx = data.findIndex((d) => d.ISOAlpha3 === ISO3);
  return (
    <>
      <AreaGraphEl>
        <AreaGraph
          data={data[countryIndx]}
        />
      </AreaGraphEl>
    </>
  );
};
