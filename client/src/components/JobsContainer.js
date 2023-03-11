import { useEffect } from 'react';
import Loading from './Loading';
import Job from './Job';
import Alert from './Alert';
import Wrapper from '../assets/wrappers/JobsContainer';
import { useAppContext } from '../context/appContext';
import PageBtnContainer from './PageBtnContainer';

const JobsContainer = () => {
  const {
    showAlert,
    getJobs,
    jobs,
    isLoading,
    page,
    totalJobs,
    search,
    searchStatus,
    searchType,
    sort,
    numOfPages,
  } = useAppContext();

  useEffect(() => {
    getJobs();
    // NOTE - we can also implement the useCallback function here - The followiing line is the quick and dirty way to clear the warning
    // eslint-disable-next-line
  }, [search, searchStatus, searchType, sort, page]);

  if (isLoading) {
    return <Loading center />;
  }

  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalJobs} job{jobs.length > 1 && 's'} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};
export default JobsContainer;
