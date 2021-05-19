import axios from 'axios';

const serverUrl = 'https://ingress-nginx-controller.ingress-nginx.svc.cluster.local'

const browserUrl = '/';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: serverUrl,
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: browserUrl,
    });
  }
};

export default buildClient;
