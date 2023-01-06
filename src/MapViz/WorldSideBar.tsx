import { useContext } from 'react';
import styled from 'styled-components';
import sortBy from 'lodash.sortby';
import { CtxDataType, DataType } from '../Types';
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
  const sortedData = Indicator === 'top10WID' ? sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)][Indicator]) : sortBy(filteredData, (d) => d.data[d.data.findIndex((el) => el.year === Year)][Indicator]).reverse();
  return (
    <>
      <CardsContainerEl>
        <TableEl>
          <SideBarCardTable
            title={`Countries Ranked by ${Indicator === 'b40T10RatioWID' ? 'Bottom 40% / Top 10% Income Share Ratio' : Indicator === 'bottom40WID' ? 'Bottom 40% Income Share' : 'Top 10% Income Share'}`}
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
