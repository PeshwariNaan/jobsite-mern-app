import React, { useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_FAIL,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  DELETE_JOB_ERROR,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from './actions';
import reducer from './reducer';

//**********Removed to change over to using cookies*** -NO LONGER USING LOCAL STORAGE */
// const token = localStorage.getItem('token');
// const user = localStorage.getItem('user');
// const userLocation = localStorage.getItem('location');

const initialState = {
  isLoading: false,
  isUserLoading: true,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  userLocation: '',
  jobLocation: '',
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['interview', 'pending', 'declined'],
  status: 'pending',
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
  showSidebar: false,
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
};

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios - global setup
  // axios.defaults.headers['Authorization'] = `Bearer ${state.token}`;

  // AXIOS INTERCEPTORS
  const authFetch = axios.create({
    baseURL: '/api/v1/',
  });

  // Request - **** ON MOVING TO COOKIES WE NO LONGER NEED THIS INTERCEPTOR
  // authFetch.interceptors.request.use(
  //   (config) => {
  //     config.headers['Authorization'] = `Bearer ${state.token}`;
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  // Response
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      //console.log(error.response);
      if (error.response.status === 401) {
        //console.log('AUTH ERROR');
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  // DISPLAY ALERT FUNCTION
  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  // TIME-OUT FUNCTION FOR CLEARING ALERTS
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  // ADDS USER TO LOCAL STORAGE -***REMOVED TO USE COOKIES
  // const addUserToLocalStorage = ({ user, token, location }) => {
  //   localStorage.setItem('user', JSON.stringify(user));
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('location', location);
  // };

  // REMOVE USER DATA FROM LOCAL STORAGE -***REMOVED TO USE COOKIES
  // const removeUserFromLocalStorage = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('location');
  // };

  // REGISTERS NEW USER - JUST FOR EXAMPLE - MOVED TO SETUP USER
  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios({
        method: 'POST',
        url: '/api/v1/auth/register',
        data: currentUser,
      });
      //console.log(response);
      const { user, token, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: REGISTER_USER_FAIL,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  // LOGS IN USER - JUST FOR EXAMPLE - MOVED TO SETUP USER
  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios({
        method: 'POST',
        url: '/api/v1/auth/login',
        data: currentUser,
      });
      //console.log(response);
      const { user, token, location } = data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: LOGIN_USER_FAIL,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  // SET UP USER - HANDLES NEW USERS AND LOGIN
  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios({
        method: 'POST',
        url: `/api/v1/auth/${endPoint}`,
        data: currentUser,
      });
      //console.log(response);
      const { user, location } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText },
      });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: SETUP_USER_FAIL,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  // CREATE A NEW JOB
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post('/jobs', {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  // GET ALL JOBS
  const getJobs = async () => {
    const { search, searchStatus, searchType, sort, page } = state;

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOBS_BEGIN });

    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: { jobs, totalJobs, numOfPages },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  // TOGGLE THE SIDEBAR
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  // LOGOUT USER
  const logoutUser = async () => {
    await authFetch.get('/auth/logout');
    dispatch({ type: LOGOUT_USER });

    //removeUserFromLocalStorage();
  };

  // HANDLE CHANGE
  const handleChange = ({ name, value }) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: { name, value },
    });
  };

  // CLEAR VALUES
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  // UPDATE USER
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch(
        'auth/updateUser',
        currentUser
        // Below was first implementation where we send the header like this..
        // {
        //   headers: {
        //     Authorization: `Bearer ${state.token}`,
        //   },
        // }
      );
      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  // SET EDIT JOB
  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  // DELETE JOB
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      //logoutUser(); // We only took this out because we have a test user - normally we want to logout user
      // Because of this we add DELETE_JOB_ERROR
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  // EDIT JOB
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  // GET CURRENT USER
  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      const { user, location } = data;

      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status === 401) return;
      logoutUser();
    }
  };

  // SHOW STATS FOR JOBS
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });

    try {
      const { data } = await authFetch('/jobs/stats');
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearValues();
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  useEffect(() => {
    console.log('run getCurrentUser');
    getCurrentUser();
    // eslint-disable-next-line
  }, []);

  const value = {
    ...state,
    initialState,
    displayAlert,
    registerUser,
    loginUser,
    setupUser,
    toggleSidebar,
    logoutUser,
    updateUser,
    handleChange,
    clearValues,
    createJob,
    getJobs,
    setEditJob,
    editJob,
    deleteJob,
    showStats,
    clearFilters,
    changePage,
    getCurrentUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  // We set up a hook so we don't have to import useContext etc... to every component we need access.
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
