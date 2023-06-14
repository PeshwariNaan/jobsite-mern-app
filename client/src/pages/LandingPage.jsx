import { Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import main from '../assets/images/main.svg';
import { Logo } from '../components'; // This is coming from index.jsx in the components folder - This cuts down on clutters

import Wrapper from '../assets/wrappers/LandingPage.styles';

const LandingPage = () => {
  const { user } = useAppContext();
  return (
    <>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          <div className="info">
            <h1>
              job <span>tracking</span> app
            </h1>
            <p>
              Your premier site for tracking your applications and keeping
              yourself organized on the job hunt. Never agian forget the
              companies you have applied to or the jobs you have interviewed
              for.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login/Register
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </>
  );
};

export default LandingPage;
