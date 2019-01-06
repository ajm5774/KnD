import * as requestPromise from 'request-promise';

export class RequestMaker {
  static async http(requestObj: payload) {
    try {
      const resp = await requestPromise(requestObj);
      return resp;
    } catch (error) {
      console.log(error);
    }
  }

  static async getJsonResponse(method: string, url: string) {
    const requestBuilder = new RequestBuilder(method, url);
    const resp = await RequestMaker.http(requestBuilder.get());
    const response = JSON.parse(resp);
    return response;
  }
}

interface payload {
  url: string;
  method: string;
  body?: object;
  qs?: object;
}

export class RequestBuilder {
  payload: payload;

  constructor(method: string, url: string) {
    this.payload = {
      method,
      url
    }
  }

  method(method: string): RequestBuilder {
    this.payload.url = method;
    return this;
  }

  body(data: object): RequestBuilder {
    this.payload.body = {
      ...this.payload.body,
      ...data
    };

    return this;
  }

  // check why slack requires this being qs instead of just a body param
  qs(data: object): RequestBuilder {
    this.payload.qs = {
      ...this.payload.qs,
      ...data
    }

    return this;
  }

  get(): payload {
    return this.payload;
  }
}