import { useContext } from 'react';
import { CountrySideBar } from './CountrySideBar';
import { WorldSideBar } from './WorldSideBar';
import { CtxDataType, DataType } from '../Types';
import Context from '../Context/Context';

interface Props {
  data: DataType[];
}

export const SideBarBody = (props: Props) => {
  const {
    data,
  } = props;
  const {
    Country,
    ISO3,
  } = useContext(Context) as CtxDataType;
  return (
    <>
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
    </>
  );
};
