import { RequestBuilder, RequestMaker } from './requestMaker';
import config from '../config';

const SLACK_TOKEN = config.slack.connectionToken;
const slackChatUrl = `https://slack.com/api/chat.postMessage?token=${SLACK_TOKEN}`;
const slackRTMUrl = `https://slack.com/api/rtm.connect?token=${SLACK_TOKEN}`;
const slackUsersUrl = `https://slack.com/api/users.list?token=${SLACK_TOKEN}`;

export default class SlackService {
  static reply(text: string, channel: string) {
    const url = `${slackChatUrl}&channel=${channel}`;
    const requestBuilder = new RequestBuilder('POST', url);

    if (text) {
      requestBuilder.qs({ text });
    }

    return RequestMaker.http(requestBuilder.get());
  }

  static async getUsers(): Promise<any[]> {
     const resp = await SlackService.getJsonResponse('GET', slackUsersUrl);
     return resp.members;
  }

  static async getConnectionUrl(): Promise<string> {
    const resp = await SlackService.getJsonResponse('POST', slackRTMUrl);
    return resp.url;
  }

  static async getJsonResponse(method: string, url: string) {
    const requestBuilder = new RequestBuilder(method, url);
    const resp = await RequestMaker.http(requestBuilder.get());
    const response = JSON.parse(resp);
    return response;
  }
}
