import { useContext } from 'react';
import sortBy from 'lodash.sortby';
import { CtxDataType, DataType } from '../Types';
import Context from '../Context/Context';
import { SideBarCard } from '../Components/SideBarCard';

interface Props {
  data: DataType[];
}

export const CountryBoxesOnTop = (props: Props) => {
  const {
    data,
  } = props;
  const {
    Year,
    ISO3,
  } = useContext(Context) as CtxDataType;
  const filteredData = data.filter((d) => d.data.findIndex((el) => el.year === Year) !== -1);
  const sortedByRatio = sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].b40T10RatioWID);
  const sortedByB40 = sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].bottom40WID);
  const sortedByT10 = sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].top10WID).reverse();
  const countryIndx = data.findIndex((d) => d.ISOAlpha3 === ISO3);
  const yearData = data[countryIndx].data.findIndex((d) => d.year === Year) !== -1 ? data[countryIndx].data[data[countryIndx].data.findIndex((d) => d.year === Year)] : undefined;
  return (
    <div className='flex-div flex-wrap'>
      <SideBarCard
        title='Income Share: Bottom 40%'
        value={yearData ? `${(yearData.bottom40WID * 100).toFixed(1)}%` : 'NA'}
        valueSubNote={sortedByB40.findIndex((d) => d.ISOAlpha3 === ISO3) === -1 ? undefined : (
          <>
            <span className='bold' style={{ color: 'var(--black-700)' }}>
              {(filteredData.length - (sortedByB40.findIndex((d) => d.ISOAlpha3 === ISO3) + 1))}
              {' '}
              countries
            </span>
            {' '}
            have a higher bottom 40% income share (data available for
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
        title='Income Share: Top 10%'
        value={yearData ? `${(yearData.top10WID * 100).toFixed(1)}%` : 'NA'}
        valueSubNote={sortedByT10.findIndex((d) => d.ISOAlpha3 === ISO3) === -1 ? undefined : (
          <>
            <span className='bold' style={{ color: 'var(--black-700)' }}>
              {(filteredData.length - (sortedByT10.findIndex((d) => d.ISOAlpha3 === ISO3) + 1))}
              {' '}
              countries
            </span>
            {' '}
            have a lower top 10% income share (data available for
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
        title='Income Share Ratio'
        tooltip
        value={yearData ? `${(yearData.b40T10RatioWID).toFixed(3)}` : 'NA'}
        valueSubNote={sortedByRatio.findIndex((d) => d.ISOAlpha3 === ISO3) === -1 ? undefined : (
          <>
            <span className='bold' style={{ color: 'var(--black-700)' }}>
              {(filteredData.length - (sortedByRatio.findIndex((d) => d.ISOAlpha3 === ISO3) + 1))}
              {' '}
              countries
            </span>
            {' '}
            have a higher bottom 40 / top 10 income share ratio (data available for
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
    </div>
  );
};
