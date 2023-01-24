import {
  useContext, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import { Slider } from 'antd';
import Context from '../Context/Context';
import { PauseIcon, PlayIcon } from '../icons';
import { CtxDataType, YearListDataType } from '../Types';

interface Props {
  years: YearListDataType[];
}

const TimeSliderUnitEl = styled.div`
  display: flex;
  gap: var(--spacing-05);
  align-items: center;
  padding: 1rem;
  position: relative;
  background-color: var(--gray-300);
`;

const IconEl = styled.div`
  cursor: pointer;
  height: 1.5rem;
  margin-right: 0.4rem;
`;

export const SliderEl = (props: Props) => {
  const {
    years,
  } = props;
  const [play, setPlay] = useState(false);
  const [year, setYear] = useState(2021);
  const {
    updateYear,
    Year,
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
          ? <PauseIcon size={24} color='#D12800' />
          : <PlayIcon size={24} color='#D12800' />
      }
      </IconEl>
      <p style={{ fontSize: '1rem' }}>{years[0].label}</p>
      <Slider
        className='undp-slider'
        defaultValue={years[years.length - 1].label}
        value={Year}
        min={years[0].label}
        max={years[years.length - 1].label}
        step={1}
        style={{ width: '97%', margin: '0 auto' }}
        onChange={(d) => { setYear(d); }}
        tooltip={{ open: true }}
      />
      <p style={{ fontSize: '1rem' }}>{years[years.length - 1].label}</p>
    </TimeSliderUnitEl>
  );
};
