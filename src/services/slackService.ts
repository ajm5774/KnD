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
    const resp = await RequestMaker.getJsonResponse('GET', slackUsersUrl);
    return resp.members;
  }

  static async getRtmUrl(): Promise<string> {
    const resp = await RequestMaker.getJsonResponse('POST', slackRTMUrl);
    return resp.url;
  }
}
