import {
  useContext, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import Select from 'react-dropdown-select';
import { CtxDataType, DataType, YearListDataType } from '../Types';
import { CaretDown } from '../icons';
import { Map } from './Map';
import { SideBarBody } from './SideBarBody';
import { AreaGraph } from './AreaGraph';
import Context from '../Context/Context';
import { Slider } from './Slider';

interface Props {
  years: YearListDataType[];
  data: DataType[];

}

const MapEl = styled.div`
  width: 75%;
  background-color: var(--blue-very-light);
  max-height: 64rem;
  @media (max-width: 960px) {
    width: 100%;
    height: calc(640 * (100vw - 40px) / 960);
  }
  @media (max-width: 620px) {
    width: 100%;
    height: calc(640 * (100vw - 40px) / 960);
  }
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: -0.5rem;
`;

const VizContainer = styled.div`
  display: flex;
  justify-content: space-between; 
  box-shadow: var(--shadow);
  @media (max-width: 960px) {
    flex-wrap: wrap;
  }
`;

const CaretIconEl = styled.div`
  cursor: pointer;
  height: 2.4rem;
  margin-right: 0.4rem;
  margin-left: -1.8rem;
  margin-top: -2px;
`;

const SideBarEl = styled.div`
  font-size: 2rem;
  line-height: 3rem;
  color: var(--black);
  width: 25%;
  background-color: var(--white);
  box-shadow: var(--shadow-right);
  z-index: 5;
  padding-top: 1rem;
  position: relative;
  height: 64rem;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: var(--black-100); 
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: var(--black-500);
    border-radius: 2rem; 
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: var(--black-550);
  }
  @media (max-width: 960px) {
    width: 100%;
    height: auto;
    box-shadow: var(--shadow-bottom);
  }
`;

const HeaderTextEl = styled.div`
  margin-right: 1rem;
  color: var(--black-600);
`;

const HeaderEl = styled.div`
  background-color: var(--white);
  padding:1.5rem 1rem 1rem 1rem;
  box-shadow: var(--shadow-bottom);
  border-bottom: 1px solid var(--black-400);
  font-size: 2.4rem;
  font-weight: bold;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
`;

const AreaGraphContainer = styled.div`
  display: none;
  @media (max-width: 960px) {
    display: block;
    padding: 1rem 1rem 2rem 1rem;
    background-color: var(--blue-very-light);
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
      <HeaderEl>
        <HeaderTextEl>
          Income Shares for
          {Country === 'World' ? ' the' : null}
        </HeaderTextEl>
        <FlexDiv>
          <Select
            options={countryList}
            className='countrySelect'
            onChange={(el: any) => { updateCountry(el[0].label); updateISO3(el[0].ISOCode); }}
            values={
                [
                  {
                    label: Country,
                    ISOCode: ISO3,
                  },
                ]
              }
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='auto'
            searchable={false}
            dropdownGap={2}
          />
          <CaretIconEl>
            <CaretDown size={24} color='#018EFF' />
          </CaretIconEl>
        </FlexDiv>
        <HeaderTextEl>
          in
        </HeaderTextEl>
        <FlexDiv>
          <Select
            options={years}
            className='countrySelect'
            onChange={(el: any) => { updateYear(el[0].label); }}
            values={[{ label: Year }]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='auto'
            searchable={false}
            dropdownGap={2}
          />
          <CaretIconEl>
            <CaretDown size={24} color='#018EFF' />
          </CaretIconEl>
        </FlexDiv>
      </HeaderEl>
      <VizContainer>
        <SideBarEl>
          <SideBarBody data={data} />
        </SideBarEl>
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
      <Slider
        years={years}
      />
    </RootEl>
  );
};
