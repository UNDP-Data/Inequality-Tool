import { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-dropdown-select';
import { DataType, YearListDataType } from '../Types';
import { CaretDown } from '../icons';
import { DumbellChart } from './DumbellChart';

interface Props {
  data: DataType[];
  years: YearListDataType[];

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
  margin-right: 1rem;
`;

export const DumbellChartViz = (props: Props) => {
  const { data, years } = props;
  const [year, setYear] = useState(years[years.length - 1].label);
  const [sortedBy, setSortedBy] = useState(
    {
      label: 'Country Name',
      key: 'country',
    },
  );
  const sortingOptions = [
    {
      label: 'Country Name',
      key: 'country',
    },
    {
      label: 'Wealth Share: Bottom 40%',
      key: 'bottom40WID',
    },
    {
      label: 'Wealth Share: Top 10%',
      key: 'top10WID',
    },
    {
      label: 'Wealth Share Difference',
      key: 'diff',
    },
    {
      label: 'Wealth Share Ratio',
      key: 'ratio',
    },
  ];
  return (
    <El>
      <Filters>
        <FlexDiv>
          <div>Difference in the Wealth Share for bottom 40% and top 10% for</div>
          <Select
            options={years}
            className='countrySelect'
            onChange={(el: any) => { setYear(el[0].label); }}
            values={[{ label: year }]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='auto'
            dropdownGap={2}
          />
          <IconEl>
            <CaretDown size={24} color='#110848' />
          </IconEl>
          <div>sorted by</div>
          <Select
            options={sortingOptions}
            className='countrySelect'
            onChange={(el: any) => { setSortedBy(el[0]); }}
            values={[sortedBy]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='auto'
            dropdownGap={2}
          />
          <IconEl>
            <CaretDown size={24} color='#110848' />
          </IconEl>
        </FlexDiv>
      </Filters>
      <DumbellChart
        data={data}
        year={year}
        sortedBy={sortedBy.key}
      />
    </El>
  );
};
