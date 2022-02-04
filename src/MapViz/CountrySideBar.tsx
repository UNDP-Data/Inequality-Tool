import styled from 'styled-components';
import { useContext } from 'react';
import sortBy from 'lodash.sortby';
import { AreaGraph } from './AreaGraph';
import { CtxDataType, DataType } from '../Types';
import { SideBarCard } from '../Components/SideBarCard';
import Context from '../Context/Context';

interface Props {
  data: DataType[];
}

const CardsContainerEl = styled.div`
  flex-wrap: wrap;
  @media (max-width: 960px) {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  @media (max-width: 800px) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
`;

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
    Year,
  } = useContext(Context) as CtxDataType;
  const filteredData = data.filter((d) => d.data.findIndex((el) => el.year === Year) !== -1);
  const sortedByRatio = sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].b40T10RatioWID);
  const sortedByB40 = sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].bottom40WID);
  const sortedByT10 = sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].top10WID).reverse();
  const countryIndx = data.findIndex((d) => d.ISOAlpha3 === ISO3);
  const yearData = data[countryIndx].data.findIndex((d) => d.year === Year) !== -1 ? data[countryIndx].data[data[countryIndx].data.findIndex((d) => d.year === Year)] : undefined;
  return (
    <>
      <CardsContainerEl>
        <SideBarCard
          title='Income Share: Bottom 40% '
          value={yearData ? `${(yearData.bottom40WID * 100).toFixed(1)}%` : 'NA'}
          valueSubNote={sortedByB40.findIndex((d) => d.ISOAlpha3 === ISO3) === -1 ? undefined : (
            <>
              <span className='bold' style={{ color: 'var(--black-700)' }}>
                {(filteredData.length - (sortedByB40.findIndex((d) => d.ISOAlpha3 === ISO3) + 1))}
                {' '}
                countries
              </span>
              {' '}
              have lower income share for b. 40% (data available for
              {' '}
              <span className='bold'>
                {filteredData.length}
                {' '}
                countries
              </span>
              )
            </>
          )}
        />
        <SideBarCard
          title='Income Share: Top 10% '
          value={yearData ? `${(yearData.top10WID * 100).toFixed(1)}%` : 'NA'}
          valueSubNote={sortedByT10.findIndex((d) => d.ISOAlpha3 === ISO3) === -1 ? undefined : (
            <>
              <span className='bold' style={{ color: 'var(--black-700)' }}>
                {(filteredData.length - (sortedByT10.findIndex((d) => d.ISOAlpha3 === ISO3) + 1))}
                {' '}
                countries
              </span>
              {' '}
              have higher income share for t. 10% (data available for
              {' '}
              <span className='bold'>
                {filteredData.length}
                {' '}
                countries
              </span>
              )
            </>
          )}
        />
        <SideBarCard
          title='Income Share Ratio '
          titleSubNote='Bottom 40% / Top 10%'
          value={yearData ? `${(yearData.b40T10RatioWID).toFixed(3)}` : 'NA'}
          valueSubNote={sortedByRatio.findIndex((d) => d.ISOAlpha3 === ISO3) === -1 ? undefined : (
            <>
              <span className='bold' style={{ color: 'var(--black-700)' }}>
                {(filteredData.length - (sortedByRatio.findIndex((d) => d.ISOAlpha3 === ISO3) + 1))}
                {' '}
                countries
              </span>
              {' '}
              have lower income share ratio (data available for
              {' '}
              <span className='bold'>
                {filteredData.length}
                {' '}
                countries
              </span>
              )
            </>
          )}
        />
      </CardsContainerEl>
      <AreaGraphEl>
        <AreaGraph
          data={data[countryIndx]}
        />
      </AreaGraphEl>
    </>
  );
};
