import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import { ServerRoutes } from '../config/routes';
import Header from '../core/header';

const AppComponent = ({ Component, currentUser, pageProps }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get(ServerRoutes.currentUser);

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser,
    );
  }

  return { pageProps, ...data };
};

export default AppComponent;
