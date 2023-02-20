import { useState, useEffect } from 'react';
import { Logo, FormRow } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage.styles';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const RegisterPage = () => {
  const [values, setValues] = useState(initialState);
  // global state and useNavigate

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
        <h3>Login</h3>

        <FormRow
          labelText="name"
          type="text"
          value={values.name}
          name="name"
          handleChange={handleChange}
        />
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
      </form>
    </Wrapper>
  );
};
export default RegisterPage;
