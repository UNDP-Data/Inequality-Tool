import {
  useContext, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import { Select } from 'antd';
import { CtxDataType, DataType, YearListDataType } from '../Types';
import { Map } from './Map';
import { AreaGraph } from './AreaGraph';
import Context from '../Context/Context';
import { SliderEl } from './Slider';
import { WorldBoxesOnTop } from './WorldBoxesOnTop';
import { CountryBoxesOnTop } from './CountryBoxesOnTop';

import '../style/selectStyle.css';

interface Props {
  years: YearListDataType[];
  data: DataType[];

}

const MapEl = styled.div`
  width: 100%;
  height: 50rem;
  @media (max-width: 960px) {
    width: 100%;
    height: calc(640 * (100vw - 40px) / 960);
  }
  @media (max-width: 620px) {
    width: 100%;
    height: calc(640 * (100vw - 40px) / 960);
  }
`;

const VizContainer = styled.div`
  background-color: var(--gray-200);
  @media (max-width: 960px) {
    flex-wrap: wrap;
  }
`;

const AreaGraphContainer = styled.div`
  display: none;
  @media (max-width: 960px) {
    display: block;
    padding: 1rem 1rem 2rem 1rem;
    border-top: 1px solid var(--black);
  }
`;

const RootEl = styled.div`
  box-shadow: var(--shadow);
`;

export const MapViz = (props: Props) => {
  const { data, years } = props;
  const countryList = data.map((d) => (
    {
      label: d.country,
      ISOCode: d.ISOAlpha3,
    }
  )).sort((a, b) => a.label.localeCompare(b.label));
  countryList.unshift({ label: 'World', ISOCode: '' });
  const [mapWidth, setMapWidth] = useState<number | undefined>(undefined);
  const [mapHeight, setMapHeight] = useState<number | undefined>(undefined);
  const mapRef = useRef<HTMLDivElement>(null);
  const {
    Country,
    ISO3,
    Year,
    updateCountry,
    updateISO3,
    updateYear,
  } = useContext(Context) as CtxDataType;

  useEffect(() => {
    setMapWidth(mapRef?.current?.offsetWidth);
    setMapHeight(mapRef?.current?.offsetHeight);
  }, [mapRef]);

  return (
    <RootEl>
      <div className='flex-div flex-vert-align-center gap-04 flex-wrap margin-bottom-07'>
        <h3 className='undp-typography margin-bottom-00'>
          Income Shares for
          {Country === 'World' ? ' the' : null}
        </h3>
        <Select
          className='undp-select undp-select-inline'
          value={Country}
          style={{ width: 'auto' }}
          onChange={(el) => { updateCountry(el); updateISO3(countryList[countryList.findIndex((d) => d.label === el)].ISOCode); }}
        >
          {
            countryList.map((d, i) => <Select.Option className='undp-select-option' key={i} value={d.label}>{d.label}</Select.Option>)
          }
        </Select>
        <h3 className='undp-typography margin-bottom-00'>
          in
        </h3>
        <Select
          className='undp-select undp-select-inline'
          value={Year}
          style={{ width: 'auto' }}
          onChange={(el) => { updateYear(el); }}
        >
          {
            years.map((d, i) => <Select.Option className='undp-select-option' key={i} value={d.label}>{d.label}</Select.Option>)
          }
        </Select>
      </div>
      {
        Country === 'World' ? <WorldBoxesOnTop data={data} /> : <CountryBoxesOnTop data={data} />
      }
      <VizContainer className='flex-div flex-space-between'>
        <MapEl ref={mapRef}>
          <Map
            data={data}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
          />
        </MapEl>
      </VizContainer>
      {
        Country !== 'World' && data.findIndex((d) => d.ISOAlpha3 === ISO3) !== -1 ? (
          <AreaGraphContainer>
            <AreaGraph
              data={data[data.findIndex((d) => d.ISOAlpha3 === ISO3)]}
              fullScreen
            />
          </AreaGraphContainer>
        ) : null
      }
      <SliderEl
        years={years}
      />
    </RootEl>
  );
};
