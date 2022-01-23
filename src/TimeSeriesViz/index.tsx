import { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-dropdown-select';
import { DataType } from '../Types';
import { CaretDown } from '../icons';
import { AreaGraph } from './AreaGraph';

interface Props {
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
  font-size: 2.4rem;
  flex-wrap: wrap;
`;

const IconEl = styled.div`
  height: 2.4rem;
  margin-left: -1.3rem;
`;

export const TimeSeriesViz = (props: Props) => {
  const { data } = props;
  const countryList = data.map((d) => (
    {
      label: d.country,
    }
  )).sort((a, b) => a.label.localeCompare(b.label));
  const [country, setCountry] = useState(countryList[0].label);
  return (
    <El>
      <Filters>
        <FlexDiv>
          <div>Wealth Share Change Over Time For</div>
          <Select
            options={countryList}
            className='countrySelect'
            onChange={(el: any) => { setCountry(el[0].label); }}
            values={[{ label: country }]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='auto'
            searchable
            dropdownGap={2}
          />
          <IconEl>
            <CaretDown size={24} color='#110848' />
          </IconEl>
        </FlexDiv>
      </Filters>
      <AreaGraph
        data={data[data.findIndex((d) => d.country === country)]}
      />
    </El>
  );
};
