import Router from'next/router';
import { useEffect } from 'react';
import { ClientRoutes, ServerRoutes } from '../../config/routes';
import useRequest from '../../hooks/use-request';

const Signout = () => {
  const { doRequest } = useRequest({
    url: ServerRoutes.signout,
    method: 'get',
    onSuccess: () => Router.push(ClientRoutes.home),
  });

  useEffect(() => {
    doRequest();
  });

  return <div>Signing out...</div>;
};

export default Signout;
