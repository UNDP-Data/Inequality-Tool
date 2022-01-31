import styled from 'styled-components';
import { AreaGraph } from './AreaGraph';
import { DataType } from '../Types';
import { SideBarCard } from '../Components/SideBarCard';

interface Props {
  year: number;
  data: DataType;
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

const AreaGraphEl = styled.div`
  @media (max-width: 960px) {
    display: none;
  }
`;

export const CountrySideBar = (props: Props) => {
  const {
    year,
    data,
  } = props;
  const yearData = data.data.findIndex((d) => d.year === year) !== -1 ? data.data[data.data.findIndex((d) => d.year === year)] : undefined;
  return (
    <>
      <CardsContainerEl>
        <SideBarCard
          title='Income Share: Bottom 40% '
          titleSubNote={`(for  ${year})`}
          value={yearData ? `${(yearData.bottom40WID * 100).toFixed(1)}%` : 'NA'}
        />
        <SideBarCard
          title='Income Share: Top 10% '
          titleSubNote={`(for  ${year})`}
          value={yearData ? `${(yearData.top10WID * 100).toFixed(1)}%` : 'NA'}
        />
        <SideBarCard
          title='Income Share Ratio '
          titleSubNote={`Bottom 40% / Top 10% (for  ${year})`}
          value={yearData ? `${(yearData.b40T10RatioWID).toFixed(3)}` : 'NA'}
        />
      </CardsContainerEl>
      <AreaGraphEl>
        <AreaGraph
          data={data}
        />
      </AreaGraphEl>
    </>
  );
};
