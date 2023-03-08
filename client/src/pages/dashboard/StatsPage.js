import { useEffect } from 'react';
import { useAppContext } from '../../context/appContext';
import { StatsContainer, Loading, ChartsContainer } from '../../components';

const StatsPage = () => {
  const { showStats, isLoading, monthlyApplications } = useAppContext();

  useEffect(() => {
    showStats();
    // NOTE - we can also implement the useCallback function here - The followiing line is the quick and dirty way to clear the warning
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
};
export default StatsPage;
