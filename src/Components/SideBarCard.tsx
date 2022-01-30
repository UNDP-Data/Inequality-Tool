import styled from 'styled-components';

interface Props {
    title: string;
    titleSubNote?: string;
    value: string;
}

const CardEl = styled.div`
  border-radius: 5px;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  @media (max-width: 960px) {
    width: calc(33.33% - 1rem);
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const CardTitleEl = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  color: var(--blue-medium);
  background-color: var(--blue-very-light);
  padding: 0.75rem 0.5rem;
  line-height: 1.6rem;
  @media (max-width: 960px) {
  font-size: 1.2rem;
  }
`;

const CardBodyEl = styled.div`
  font-size: 2.8rem;
  padding: 1.5rem 0;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  color: var(--primary-blue);
  background-color: var(--white);
`;

const SubNote = styled.span`
  font-size: 1.2rem;
  text-transform: none;
  font-weight: normal;
  font-style: italic;
  color: var(--black-550);
  @media (max-width: 960px) {
  font-size: 1rem;
  }
`;

export const SideBarCard = (props: Props) => {
  const {
    title,
    titleSubNote,
    value,
  } = props;

  return (
    <CardEl>
      <CardTitleEl>
        {title}
        {' '}
        <SubNote>
          <br />
          {titleSubNote}
        </SubNote>
      </CardTitleEl>
      <CardBodyEl>
        {value}
      </CardBodyEl>
    </CardEl>
  );
};
