import { Link } from 'react-router-dom';
import notFoundImg from '../assets/images/not-found.svg';
import Wrapper from '../assets/wrappers/ErrorPage.styles';

const ErrorPage = () => {
  return (
    <Wrapper className="full-page">
      <div>
        <img src={notFoundImg} alt="404 alert" />
        <h3>Oh no!Page not found.</h3>
        <p>We can't find the page you are looking for.</p>
        <Link to="/">Back Home</Link>
      </div>
    </Wrapper>
  );
};
export default ErrorPage;
