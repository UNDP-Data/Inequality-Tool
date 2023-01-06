import { useState } from 'react';
import styled from 'styled-components';
import { Select } from 'antd';
import { DataType, YearListDataType } from '../Types';
import { DumbellChart } from './DumbellChart';

interface Props {
  data: DataType[];
  years: YearListDataType[];

}

const DumbellChartEl = styled.div`
  height: 40rem;
  background-color: var(--gray-100);
  padding: 0 var(--spacing-05);
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
    <div className='margin-top-09 margin-bottom-07'>
      <div className='flex-div flex-vert-align-center gap-04 flex-wrap margin-bottom-07'>
        <h3 className='undp-typography margin-bottom-00'>
          Difference in the Income Share for bottom 40% and top 10% for
        </h3>
        <Select
          className='undp-select undp-select-inline'
          value={year}
          style={{ width: 'auto' }}
          onChange={(el) => { setYear(el); }}
        >
          {
              years.map((d, i) => <Select.Option className='undp-select-option' key={i} value={d.label}>{d.label}</Select.Option>)
            }
        </Select>
        <h3 className='undp-typography margin-bottom-00'>
          sorted by
        </h3>
        <Select
          className='undp-select undp-select-inline'
          value={sortedBy.label}
          style={{ width: 'auto' }}
          onChange={(el) => { setSortedBy(sortingOptions[sortingOptions.findIndex((d) => d.label === el)]); }}
        >
          {
              sortingOptions.map((d, i) => <Select.Option className='undp-select-option' key={i} value={d.label}>{d.label}</Select.Option>)
            }
        </Select>
      </div>
      <DumbellChartEl className='undp-scrollbar'>
        <DumbellChart
          data={data}
          year={year}
          sortedBy={sortedBy.key}
        />
      </DumbellChartEl>
    </div>
  );
};
