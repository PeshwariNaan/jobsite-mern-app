import React, { useReducer, useContext } from 'react';
import { DISPLAY_ALERT, CLEAR_ALERT } from './actions';
import reducer from './reducer';

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
};

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const value = {
    ...state,
    displayAlert,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  // We set up a hook so we don't have to import useContext etc... to every component we need access.
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
