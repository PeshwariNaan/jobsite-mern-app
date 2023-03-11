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
              Flannel selvage officia DIY sunt food truck kitsch minim affogato
              polaroid man bun. Reprehenderit paleo gentrify do. Neutra roof
              party put a bird on it sartorial chillwave ugh. Mollit cupidatat
              green juice activated charcoal laboris typewriter hell of, small
              batch bespoke elit before they sold out celiac.
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
