import styled from 'styled-components';
import meanBy from 'lodash.meanby';
import { getValue } from '../Utils/getValue';
import { DataType } from '../Types';

interface Props {
  year: number;
  data: DataType[];
  country: string;
  ISO3: string;
  indicator: 'bottom40WID' | 'top10WID' | 'b40T10RatioWID';
}

const BannerEl = styled.div`
  font-size: 1.8rem;
  width: calc(100% - 6rem);
  color: var(--black-600);
  line-height: 2.4rem;
  background-color: rgba(255,255,255,0.9);
  box-shadow: var(--shadow);
  padding: 1rem;
  margin: 1rem 2rem 0 2rem;
  text-align: center;
  font-weight: normal;
  position: absolute;
  z-index: 100;
  @media (max-width: 960px) {
    font-size: 1.6rem;
    line-height: 2.2rem;
  }
  @media (max-width: 800px) {
    font-size: 1.4rem;
    line-height: 2rem;
  }
  @media (max-width: 620px) {
    font-size: 1.2rem;
    line-height: 1.8rem;
  }
`;

const Span = styled.span`
  color: var(--blue-medium);
  font-weight: bold;
`;

export const MapBanner = (props: Props) => {
  const {
    year,
    data,
    indicator,
    country,
    ISO3,
  } = props;

  const filteredData = data.filter((d) => d.data.findIndex((el) => el.year === year) !== -1);
  const mean = meanBy(filteredData, (d) => 1 / d.data[d.data.findIndex((el) => el.year === year)].b40T10RatioWID);
  return (
    <>
      {
        country === 'World'
          ? (
            <BannerEl>
              In
              {' '}
              <Span className='bold'>{year}</Span>
              , on average (based on data available for
              {' '}
              {filteredData.length}
              {' '}
              countries), income share of the top 10% was
              {' '}
              <Span className='bold'>
                {mean.toFixed(2)}
                {' '}
                times
              </Span>
              {' '}
              of bottom 40%.
            </BannerEl>
          )
          : getValue(ISO3, year, indicator, data) === -1
            ? (
              <BannerEl>
                Data for
                {' '}
                <Span className='bold'>{country}</Span>
                {' '}
                for the year
                {' '}
                <Span className='bold'>{year}</Span>
                , is not available
              </BannerEl>
            )
            : (
              <BannerEl>
                In
                {' '}
                <Span className='bold'>{year}</Span>
                , income share of the top 10% in
                {' '}
                <Span className='bold'>{country}</Span>
                {' '}
                was
                {' '}
                <Span className='bold'>
                  {(1 / getValue(ISO3, year, 'b40T10RatioWID', data)).toFixed(2)}
                  {' '}
                  times
                </Span>
                {' '}
                of bottom 40%
              </BannerEl>
            )
      }
    </>
  );
};
