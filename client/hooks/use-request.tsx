import axios from 'axios';
import { useState } from 'react';

interface Props {
  url: string,
  method: 'get' | 'post' | 'put' | 'patch',
  body?: any,
  onSuccess: Function,
}

const UseRequest = ({ url, method, body, onSuccess }: Props) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default UseRequest;
