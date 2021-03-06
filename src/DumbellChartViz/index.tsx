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
  font-size: 2rem;
  flex-wrap: wrap;
  color: var(--black-600);
`;

const IconEl = styled.div`
  height: 2.4rem;
  margin-left: -1.8rem;
  margin-top: -2px;
  margin-right: 0.5rem;
`;

const TitleText = styled.div`
  margin-right: 1rem;
`;

const DumbellChartEl = styled.div`
  height: 60rem;
  background-color: var(--black-100);
  box-shadow: var(--shadow);
  padding: 1rem;
  border-radius: 2px;
  overflow: auto;
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
      label: 'Income Share: Bottom 40%',
      key: 'bottom40WID',
    },
    {
      label: 'Income Share: Top 10%',
      key: 'top10WID',
    },
    {
      label: 'Income Share Difference',
      key: 'diff',
    },
    {
      label: 'Income Share Ratio',
      key: 'ratio',
    },
  ];
  return (
    <El>
      <Filters>
        <FlexDiv>
          <TitleText>Difference in the Income Share for bottom 40% and top 10% for</TitleText>
          <Select
            options={years}
            className='countrySelect'
            onChange={(el: any) => { setYear(el[0].label); }}
            values={[{ label: year }]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='bottom'
            dropdownGap={2}
          />
          <IconEl>
            <CaretDown size={24} color='#018EFF' />
          </IconEl>
          <TitleText>sorted by</TitleText>
          <Select
            options={sortingOptions}
            className='countrySelect'
            onChange={(el: any) => { setSortedBy(el[0]); }}
            values={[sortedBy]}
            labelField='label'
            valueField='label'
            dropdownHeight='250px'
            dropdownPosition='bottom'
            dropdownGap={2}
          />
          <IconEl>
            <CaretDown size={24} color='#018EFF' />
          </IconEl>
        </FlexDiv>
      </Filters>
      <DumbellChartEl>
        <DumbellChart
          data={data}
          year={year}
          sortedBy={sortedBy.key}
        />
      </DumbellChartEl>
    </El>
  );
};
