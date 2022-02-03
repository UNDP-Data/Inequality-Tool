import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ReactSlider from 'react-slider';
import Select from 'react-dropdown-select';
import { DataType, YearListDataType } from '../Types';
import { PauseIcon, PlayIcon, CaretDown } from '../icons';
import { Map } from './Map';
import { SideBarBody } from './SideBarBody';
import { AreaGraph } from './AreaGraph';

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
    height: calc(730 * (100vw - 40px) / 960);
  }
  @media (max-width: 620px) {
    width: 100%;
    height: calc(1024 * (100vw - 40px) / 960);
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

const TimeSliderUnitEl = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  color: var(--grey);
  box-shadow: var(--shadow-top);
  padding: 1rem;
  position: relative;
  z-index: 100;
  background-color: var(--blue-very-light);
`;

const StyledThumb = styled.div`
  padding: 0.1rem 1rem;
  font-size: 1.2rem;
  text-align: center;
  background-color: #fff;
  color: var(--blue-medium);
  font-weight: bold;
  box-shadow: var(--shadow);
  border-radius: 2rem;
  border: 1px solid var(--blue-medium);
  cursor: grab;
  margin-top: 0.9rem;
`;

const Thumb = (props: any, state: any) => {
  // eslint-disable-next-line react/destructuring-assignment
  const val = state.valueNow;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledThumb {...props}>
      {val}
    </StyledThumb>
  );
};

const YearsEl = styled.div`
  margin: 0.2rem 1rem 0 1rem;
  color: var(--black-550);
`;

const IconEl = styled.div`
  cursor: pointer;
  height: 2.4rem;
  margin-right: 0.4rem;
  margin-top: -2px;
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
  font-size: 2rem;
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
  const [country, setCountry] = useState('World');
  const [ISO3, setISO3] = useState('');
  const [play, setPlay] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(years[years.length - 1].label);
  const [mapWidth, setMapWidth] = useState<number | undefined>(undefined);
  const [mapHeight, setMapHeight] = useState<number | undefined>(undefined);
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-undef
  const timer: { current: NodeJS.Timeout | null } = useRef(null);
  useEffect(() => {
    if (play && years) {
      timer.current = setInterval(() => {
        setSelectedYear((prevCounter) => (prevCounter ? prevCounter === years[years.length - 1].label ? years[0].label : prevCounter + 1 : 2000));
      }, 1000);
    }

    if (!play && timer.current) clearInterval(timer.current);
  }, [play]);

  useEffect(() => {
    setMapWidth(mapRef?.current?.offsetWidth);
    setMapHeight(mapRef?.current?.offsetHeight);
  }, [mapRef]);

  return (
    <RootEl>
      <HeaderEl>
        <HeaderTextEl>
          Income Shares for
          {country === 'World' ? ' the' : null}
        </HeaderTextEl>
        <FlexDiv>
          <Select
            options={countryList}
            className='countrySelect'
            onChange={(el: any) => { setCountry(el[0].label); setISO3(el[0].ISOCode); }}
            values={
                [
                  {
                    label: country,
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
            onChange={(el: any) => { setSelectedYear(el[0].label); setPlay(false); }}
            values={[{ label: selectedYear }]}
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
          <SideBarBody
            country={country}
            year={selectedYear}
            data={data}
            ISO3={ISO3}
          />
        </SideBarEl>
        <MapEl ref={mapRef}>
          <Map
            year={selectedYear}
            data={data}
            setCountry={setCountry}
            country={country}
            ISO3={ISO3}
            setISO3={setISO3}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
          />
        </MapEl>
      </VizContainer>
      {
        country !== 'World' && data.findIndex((d) => d.ISOAlpha3 === ISO3) !== -1 ? (
          <AreaGraphContainer>
            <AreaGraph
              data={data[data.findIndex((d) => d.ISOAlpha3 === ISO3)]}
              fullScreen
            />
          </AreaGraphContainer>
        ) : null
      }
      <TimeSliderUnitEl>
        <IconEl onClick={() => { setPlay(!play); }}>
          {
            play
              ? <PauseIcon size={24} color='#018EFF' />
              : <PlayIcon size={24} color='#018EFF' />
          }
        </IconEl>
        <YearsEl>{years[0].label}</YearsEl>
        <ReactSlider
          min={years[0].label}
          max={years[years.length - 1].label}
          step={1}
          value={selectedYear}
          className='horizontal-slider'
          trackClassName='year-slider-track'
          renderThumb={Thumb}
          onChange={(d) => { setSelectedYear(d); }}
        />
        <YearsEl>{years[years.length - 1].label}</YearsEl>
      </TimeSliderUnitEl>
    </RootEl>
  );
};
