import CommandAddKarma from './commandAddKarma';
import SlackService from '../services/slackService';

export default class CommandSubtractKarma extends CommandAddKarma {
  public constructor(event: any) {
    super(event);

    this.regex = /\s*(\S+)\s?--(\s|$)/;
  }

  protected async doProcess(): Promise<void> {
    const userIdTarget = await this.getUserIdTarget();

    console.log(`${this.event.user} removing karma from ${userIdTarget}`);
    const totalKarma = await this.addKarma(userIdTarget, -1);
    SlackService.reply(this.getKarmaUpdatedMessage(totalKarma), this.channel);
  }
}
