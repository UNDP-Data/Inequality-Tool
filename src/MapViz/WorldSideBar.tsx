import { useContext } from 'react';
import styled from 'styled-components';
import meanBy from 'lodash.meanby';
import sortBy from 'lodash.sortby';
import { CtxDataType, DataType } from '../Types';
import { SideBarCard } from '../Components/SideBarCard';
import { SideBarCardTable } from '../Components/SideBarCardTable';
import Context from '../Context/Context';

interface Props {
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

const TableEl = styled.div`
  @media (max-width: 960px) {
    display: none;
  }
`;

const TableContainer = styled.div`
  display: none;
  @media (max-width: 960px) {
    display: block;
  }
`;
export const WorldSideBar = (props: Props) => {
  const {
    data,
  } = props;
  const {
    Year,
    Indicator,
  } = useContext(Context) as CtxDataType;
  const filteredData = data.filter((d) => d.data.findIndex((el) => el.year === Year) !== -1);
  const meanRatio = meanBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].b40T10RatioWID);
  const meanBottom40 = meanBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].bottom40WID);
  const meanTop10 = meanBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)].top10WID);
  const sortedData = Indicator === 'top10WID' ? sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)][Indicator]) : sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)][Indicator]).reverse();
  return (
    <>
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
        <TableEl>
          <SideBarCardTable
            title={`Countries Ranked by ${Indicator === 'b40T10RatioWID' ? 'bottom 40 / top10 Income Share Ratio' : Indicator === 'bottom40WID' ? 'Bottom 40% Income Share' : 'Top 10% Income Share'}`}
            titleSubNote={Indicator === 'b40T10RatioWID' ? ' (Values closer to 0 imply higher shares for the top 10, while values greater than 1 imply higher bottom 40 shares)' : Indicator === 'top10WID' ? '(Lowest share to Highest share)' : '(Highest share to Lowest share)'}
            data={sortedData}
          />
        </TableEl>
      </CardsContainerEl>
      <TableContainer>
        <SideBarCardTable
          title={`Countries Ranked by ${Indicator === 'b40T10RatioWID' ? 'Income Share Ratio' : Indicator === 'bottom40WID' ? 'Bottom 40% Income Share' : 'Top 10% Income Share'}`}
          titleSubNote={Indicator === 'b40T10RatioWID' ? ' (Values closer to 0 imply higher shares for the top 10, while values greater than 1 imply higher bottom 40 shares)' : Indicator === 'top10WID' ? '(Lowest share to Highest share)' : '(Highest share to Lowest share'}
          data={sortedData}
        />
      </TableContainer>
    </>
  );
};
