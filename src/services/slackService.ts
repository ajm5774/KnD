import { RequestBuilder, RequestMaker } from './requestMaker';
import config from '../../config';

const SLACK_TOKEN = config.slackToken;
const slackChatUrl = `https://slack.com/api/chat.postMessage?token=${SLACK_TOKEN}`;
const slackRTMUrl = `https://slack.com/api/rtm.connect?token=${SLACK_TOKEN}`;

export default class SlackService {
  static reply(text: string, channel: string) {
    const url = `${slackChatUrl}&channel=${channel}`;
    const requestBuilder = new RequestBuilder('POST', url);

    if (text) {
      requestBuilder.qs({ text });
    }

    console.log('replying slack');
    console.log(requestBuilder.get())

    return RequestMaker.http(requestBuilder.get());
  }

  static async getConnectionUrl(): Promise<string> {
    const requestBuilder = new RequestBuilder('POST', slackRTMUrl);
    const resp = await RequestMaker.http(requestBuilder.get());
    const response = JSON.parse(resp);
    return response.url;
  }
}
