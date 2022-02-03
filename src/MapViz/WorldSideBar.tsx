import styled from 'styled-components';
import meanBy from 'lodash.meanby';
import sortBy from 'lodash.sortby';
import { DataType } from '../Types';
import { SideBarCard } from '../Components/SideBarCard';
import { SideBarCardTable } from '../Components/SideBarCardTable';

interface Props {
  year: number;
  data: DataType[];
}

const CardsContainerEl = styled.div`
  flex-wrap: wrap;
  @media (max-width: 960px) {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  @media (max-width: 800px) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
`;

export const WorldSideBar = (props: Props) => {
  const {
    year,
    data,
  } = props;
  const filteredData = data.filter((d) => d.data.findIndex((el) => el.year === year) !== -1);
  const meanRatio = meanBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === year)].b40T10RatioWID);
  const meanBottom40 = meanBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === year)].bottom40WID);
  const meanTop10 = meanBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === year)].top10WID);
  const sortedData = sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === year)].b40T10RatioWID);
  return (
    <CardsContainerEl>
      <SideBarCard
        title='Income Share: Bottom 40%'
        titleSubNote={`Avg. of ${filteredData.length} countries`}
        value={`${(meanBottom40 * 100).toFixed(1)}%`}
      />
      <SideBarCard
        title='Income Share: Top 10%'
        titleSubNote={`Avg. of ${filteredData.length} countries`}
        value={`${(meanTop10 * 100).toFixed(1)}%`}
      />
      <SideBarCard
        title='Income Share Ratio'
        titleSubNote={`Bottom 40% / Top 10%, Avg. of ${filteredData.length} countries`}
        value={`${(meanRatio).toFixed(3)}`}
      />
      <SideBarCardTable
        title='Countries with Lowest Income Share Ratio'
        data={sortedData.slice(0, 5)}
        year={year}
      />
    </CardsContainerEl>
  );
};
