/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import sortBy from 'lodash.sortby';
import { AreaGraph } from './AreaGraph';
import { DataType } from '../Types';
import { SideBarCard } from '../Components/SideBarCard';

interface Props {
  year: number;
  data: DataType[];
  iso3: string;
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
    year,
    data,
    iso3,
  } = props;
  const filteredData = data.filter((d) => d.data.findIndex((el) => el.year === year) !== -1);
  const sortedByRatio = sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === year)].b40T10RatioWID);
  const sortedByB40 = sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === year)].bottom40WID);
  const sortedByT10 = sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === year)].top10WID).reverse();
  const countryIndx = data.findIndex((d) => d.ISOAlpha3 === iso3);
  const yearData = data[countryIndx].data.findIndex((d) => d.year === year) !== -1 ? data[countryIndx].data[data[countryIndx].data.findIndex((d) => d.year === year)] : undefined;
  return (
    <>
      <CardsContainerEl>
        <SideBarCard
          title='Income Share: Bottom 40% '
          value={yearData ? `${(yearData.bottom40WID * 100).toFixed(1)}%` : 'NA'}
          valueSubNote={sortedByB40.findIndex((d) => d.ISOAlpha3 === iso3) === -1 ? undefined : (
            <>
              <span className='bold' style={{ color: 'var(--black-700)' }}>
                {(filteredData.length - (sortedByB40.findIndex((d) => d.ISOAlpha3 === iso3) + 1))}
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
          valueSubNote={sortedByT10.findIndex((d) => d.ISOAlpha3 === iso3) === -1 ? undefined : (
            <>
              <span className='bold' style={{ color: 'var(--black-700)' }}>
                {(filteredData.length - (sortedByT10.findIndex((d) => d.ISOAlpha3 === iso3) + 1))}
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
          valueSubNote={sortedByRatio.findIndex((d) => d.ISOAlpha3 === iso3) === -1 ? undefined : (
            <>
              <span className='bold' style={{ color: 'var(--black-700)' }}>
                {(filteredData.length - (sortedByRatio.findIndex((d) => d.ISOAlpha3 === iso3) + 1))}
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
