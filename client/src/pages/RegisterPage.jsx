import { useState, useEffect } from 'react';
import { Logo, FormRow, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage.styles';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
  showAlert: false,
};

const RegisterPage = () => {
  const [values, setValues] = useState(initialState);
  // global state and useNavigate

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    console.log(e.target);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
  };

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {values.showAlert && <Alert message="Must complete all fields!" />}
        {!values.isMember && (
          <FormRow
            labelText="name"
            type="text"
            value={values.name}
            name="name"
            handleChange={handleChange}
          />
        )}

        <FormRow
          labelText="email"
          type="email"
          value={values.email}
          name="email"
          handleChange={handleChange}
        />
        <FormRow
          labelText="password"
          type="password"
          value={values.password}
          name="password"
          handleChange={handleChange}
        />

        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};
export default RegisterPage;
