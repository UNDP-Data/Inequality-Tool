import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ReactSlider from 'react-slider';
import { DataType, YearListDataType } from '../Types';
import { PauseIcon, PlayIcon } from '../icons';
import { Map } from './Map';

interface Props {
  years: YearListDataType[];
  data: DataType[];

}

const El = styled.div`
  margin: 6rem 0;
`;

const Filters = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  color: var(--grey);
`;

interface buttonProps {
  selected: boolean;
}

const ModelSwitch = styled.button<buttonProps>`
  border: 0;
  border-radius: 2rem;
  padding: 1rem 2rem;
  margin: 0 0 0 1rem;
  font-size: 1.6rem;
  background-color: ${(props) => (props.selected ? 'var(--navy)' : 'var(--bg-blue)')} ;
  color: ${(props) => (props.selected ? 'var(--white)' : 'var(--black)')} ;
  cursor: pointer;
`;

const TimeSliderUnitEl = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  color: var(--grey);
`;

const StyledThumb = styled.div`
  padding: 0.1rem 1rem;
  font-size: 1.4rem;
  text-align: center;
  background-color: #fff;
  color: var(--black);
  box-shadow: 0 0 0.5rem 0 rgb(0 0 0 / 25%);
  border-radius: 2rem;
  border: 1px solid #fafafa;
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
`;

const IconEl = styled.div`
  cursor: pointer;
  height: 2.4rem;
`;

export const MapViz = (props: Props) => {
  const { data, years } = props;
  const [play, setPlay] = useState(false);
  const [indicator, setIndicator] = useState<'bottom40WID' | 'top10WID' | 'b40T10RatioWID'>('bottom40WID');
  const [selectedYear, setSelectedYear] = useState<number>(years[years.length - 1].label);
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

  return (
    <El>
      <Filters>
        <FlexDiv>
          <div>Color By</div>
          <ModelSwitch selected={indicator === 'bottom40WID'} onClick={() => { setIndicator('bottom40WID'); }}>Wealth Share: Bottom 40%</ModelSwitch>
          <ModelSwitch selected={indicator === 'top10WID'} onClick={() => { setIndicator('top10WID'); }}>Wealth Share: Top 10%</ModelSwitch>
          <ModelSwitch selected={indicator === 'b40T10RatioWID'} onClick={() => { setIndicator('b40T10RatioWID'); }}>Wealth Share Ratio: Bottom 40% by Top 10%</ModelSwitch>
        </FlexDiv>
      </Filters>
      <Map
        year={selectedYear}
        data={data}
        indicator={indicator}
      />
      <TimeSliderUnitEl>
        <IconEl onClick={() => { setPlay(!play); }}>
          {
            play
              ? <PauseIcon size={24} color='#383838' />
              : <PlayIcon size={24} color='#383838' />
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
    </El>
  );
};
