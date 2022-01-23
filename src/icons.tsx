interface Props {
  size?: number;
  color?: string;
}

export const PauseIcon = (props: Props) => {
  const { size, color } = props;
  return (
    <svg width={size || '24'} height={size || '24'} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M5.74609 3C4.7796 3 3.99609 3.7835 3.99609 4.75V19.25C3.99609 20.2165 4.7796 21 5.74609 21H9.24609C10.2126 21 10.9961 20.2165 10.9961 19.25V4.75C10.9961 3.7835 10.2126 3 9.24609 3H5.74609ZM14.7461 3C13.7796 3 12.9961 3.7835 12.9961 4.75V19.25C12.9961 20.2165 13.7796 21 14.7461 21H18.2461C19.2126 21 19.9961 20.2165 19.9961 19.25V4.75C19.9961 3.7835 19.2126 3 18.2461 3H14.7461Z' fill={color || '#212121'} />
    </svg>
  );
};

export const PlayIcon = (props: Props) => {
  const { size, color } = props;
  return (
    <svg width={size || '24'} height={size || '24'} viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M10.1376 3.38186C8.30432 2.3104 6 3.63266 6 5.7561V22.2448C6 24.3682 8.30431 25.6905 10.1376 24.619L24.8348 16.0294C26.3871 15.1222 26.3872 12.8788 24.8349 11.9716L10.1376 3.38186Z' fill={color || '#212121'} />
    </svg>
  );
};

export const CaretDown = (props: Props) => {
  const { size, color } = props;
  return (
    <svg width={size || '16'} height={size || '16'} viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M4.95681 5C4.14912 5 3.67466 5.90803 4.13591 6.57107L6.76854 10.3555C7.36532 11.2134 8.63448 11.2133 9.23126 10.3555L11.8639 6.57106C12.3251 5.90803 11.8507 5 11.043 5H4.95681Z' fill={color || '#212121'} />
    </svg>
  );
};
