import CommandAddKarma from './commandAddKarmaMessage';
import SlackService from '../services/slackService';

export default class CommandSubtractKarmaMessage extends CommandAddKarma {
  public constructor(event: any) {
    super(event);

    this.regex = /\s*(\S+)\s?--(\s|$)/;
  }

  public async doProcess(): Promise<void> {
    console.log(`${this.userIdSource} removing karma from ${this.userIdTarget}`);
    const totalKarma = await this.addKarma(this.userIdTarget, -1);
    SlackService.reply(this.getKarmaUpdatedMessage(totalKarma), this.channel);
  }
}
