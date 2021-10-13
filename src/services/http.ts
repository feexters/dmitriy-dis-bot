import Axios, { AxiosInstance } from 'axios';

export class Http {
  constructor(private readonly _axios: AxiosInstance) {}

  get get() {
    return this._axios.get;
  }

  get post() {
    return this._axios.post;
  }

  get put() {
    return this._axios.put;
  }

  get patch() {
    return this._axios.patch;
  }
  get delete() {
    return this._axios.delete;
  }

  get request() {
    return this._axios.request;
  }

  get axios(): AxiosInstance {
    return this._axios;
  }
}

export const http = new Http(
  Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  }),
);
