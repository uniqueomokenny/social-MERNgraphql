import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/auth';

export default function AuthRoute({ component: Compenent, ...rest }) {
  const { user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={props => (user ? <Redirect to='/' /> : <Compenent {...props} />)}
    />
  );
}
