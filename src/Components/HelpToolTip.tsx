import styled from 'styled-components';

interface Props {
  // eslint-disable-next-line no-undef
  text: JSX.Element;
  x: number;
  y: number;
}

interface TooltipElProps {
  x: number;
  y: number;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 8;
  padding: 0.875rem;
  border-radius: 2px;
  font-size: 0.875rem;
  background-color: var(--white);
  box-shadow: var(--shadow);
  max-width: 24rem;
  background-color: var(--white);
  box-shadow: var(--shadow);
  word-wrap: break-word;
  top: ${(props) => props.y + 20}px;
  left: ${(props) => props.x - 120}px;
  font-weight: normal;
  color: var(--black-700);
  text-align: left;
`;

export const HelpToolTip = (props: Props) => {
  const {
    text,
    x,
    y,
  } = props;
  return (
    <TooltipEl x={x} y={y}>
      {text}
    </TooltipEl>
  );
};
