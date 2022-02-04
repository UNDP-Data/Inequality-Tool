export default (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_COUNTRY':
      return { ...state, Country: action.payload };
    case 'UPDATE_ISO3':
      return { ...state, ISO3: action.payload };
    case 'UPDATE_YEAR':
      return { ...state, Year: action.payload };
    case 'UPDATE_INDICATOR':
      return { ...state, Indicator: action.payload };
    default:
      return { ...state };
  }
};
