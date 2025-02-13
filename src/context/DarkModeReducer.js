const darkModeReducer = (state, action) => {
  switch (action.type) {
    case "DARK": {
      return {
        darkMode: true,
      };
    }
    case "LIHGT": {
      return {
        darkMode: false,
      };
    }
    case "TOGGLE": {
      return {
        darkMode: !state.darkMode,
      };
    }
    default: {
      return {
        darkMode: true,
      };
    }
  }
};
export default darkModeReducer;
