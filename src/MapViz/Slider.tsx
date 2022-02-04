import {
  useContext, useEffect, useRef, useState,
} from 'react';
import ReactSlider from 'react-slider';
import styled from 'styled-components';
import Context from '../Context/Context';
import { PauseIcon, PlayIcon } from '../icons';
import { CtxDataType, YearListDataType } from '../Types';

interface Props {
  years: YearListDataType[];
}

const TimeSliderUnitEl = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  color: var(--grey);
  box-shadow: var(--shadow-top);
  padding: 1rem;
  position: relative;
  background-color: var(--blue-very-light);
`;

const IconEl = styled.div`
  cursor: pointer;
  height: 2.4rem;
  margin-right: 0.4rem;
  margin-top: -2px;
`;

const YearsEl = styled.div`
  margin: 0.2rem 1rem 0 1rem;
  color: var(--black-550);
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

export const Slider = (props: Props) => {
  const {
    years,
  } = props;

  const [play, setPlay] = useState(false);
  const [year, setYear] = useState(2021);
  const {
    Year,
    updateYear,
  } = useContext(Context) as CtxDataType;
  // eslint-disable-next-line no-undef
  const timer: { current: NodeJS.Timeout | null } = useRef(null);
  useEffect(() => {
    if (play && years) {
      timer.current = setInterval(() => {
        setYear((prevCounter) => (prevCounter ? prevCounter === years[years.length - 1].label ? years[0].label : prevCounter + 1 : 2000));
      }, 1000);
    }

    if (!play && timer.current) clearInterval(timer.current);
  }, [play]);

  useEffect(() => {
    updateYear(year);
  }, [year]);
  return (
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
        value={Year}
        className='horizontal-slider'
        trackClassName='year-slider-track'
        renderThumb={Thumb}
        onChange={(d) => { setYear(d); }}
      />
      <YearsEl>{years[years.length - 1].label}</YearsEl>
    </TimeSliderUnitEl>
  );
};
