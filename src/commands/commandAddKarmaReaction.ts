import * as _ from 'lodash';
import SlackService from '../services/slackService';
import CommandAddKarmaMessage from './commandAddKarmaMessage';

export default class CommandAddKarmaReaction extends CommandAddKarmaMessage {
  protected allowedReactions: string[] = ['+1'];
  protected reaction: string;

  public constructor(event: any) {
    super(event);

    this.channel = this.event.item.channel;
    this.reaction = this.event.reaction;
  }

  protected async canProcess(): Promise<boolean> {
    if (this.allowedReactions.includes(this.reaction) && this.event.item_user) {
      this.userIdTarget = this.event.item_user;
      this.userIdSource = this.event.user;
      this.inputUserTarget = await this.getUserName(this.userIdTarget);
      return true;
    }
    return false;
  }

  protected async getUserName(userId: string): Promise<string> {
    const users = await SlackService.getUsers();
    const user = _.find(users, (u) => u.id === userId)
    return user.name;
  }
}
