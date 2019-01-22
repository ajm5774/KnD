

import * as _ from 'lodash';
import Command from './command';
import SlackService from '../services/slackService';
import { UserModel, User } from '../db/models/user';

export default class CommandAddKarmaMessage extends Command {
  protected userIdTarget: string;
  protected userIdSource: string;
  protected inputUserTarget: string;
  protected channel: string;
  protected regex: RegExp;

  public constructor(event: any) {
    super(event);

    this.channel = this.event.channel;
    this.regex = /\s*(\S+)\s?\+\+(\s|$)/;
    this.inputUserTarget = ''
    this.userIdTarget = '';
    this.userIdSource = '';
  }

  protected async canProcess(): Promise<boolean> {
    let match = this.regex.exec(this.event.text);
    if (match) {
      this.inputUserTarget = match[1];
      this.userIdTarget = await this.getUserIdTarget(this.inputUserTarget);
      this.userIdSource = this.event.user;
      return true;
    }
    return false;
  }

  public async doProcess(): Promise<void> {
    console.log(`${this.userIdSource} giving karma to ${this.userIdTarget}`)
    let totalKarma;
    let karmaUpdatedMessage;
    if (this.userIdTarget === this.userIdSource) {
      totalKarma = await this.addKarma(this.userIdTarget, -1);
      karmaUpdatedMessage = `Cheater! ${this.getKarmaUpdatedMessage(totalKarma)}`;
    } else {
      totalKarma = await this.addKarma(this.userIdTarget, 1);
      karmaUpdatedMessage = this.getKarmaUpdatedMessage(totalKarma);
    }
    SlackService.reply(karmaUpdatedMessage, this.channel);
  }

  protected async getUserIdTarget(inputUserTarget: string): Promise<string> {
    // If the user looks like '<@UF6S35Y8G>', extract 'UF6S35Y8G' which is the user id.
    // This is the format when you call someone out with a command like '@user ++'
    const match = /\<\@(\w*)\>/.exec(inputUserTarget);
    if (match) {
      return match[1];
    }

    // Try to match the target with a user to get their id, but otherwise just return the userTarget 
    // as the id
    const user = await SlackService.getUserByName(inputUserTarget);
    return user ? user.id : inputUserTarget;
  }

  protected async findOrCreateUser(userId: string): Promise<User> {
    return new Promise<User>((resolve) => {
      UserModel.findOne({ id: userId })
        .exec()
        .then(user => {
          if (user) {
            return resolve(user);
          }
          UserModel.create({ id: userId }).then((user) => {
            return resolve(user);
          });
        });
    });
  }

  protected async addKarma(userId: string, amount: number): Promise<number> {
    let user = await this.findOrCreateUser(userId);
    await UserModel.increment({ id: userId }, amount); // atomic
    // the karma count doesn't auto update, so get the user again.
    user = await UserModel.findOne({ id: userId }).exec() as User;
    return user.karma;
  }

  protected getKarmaUpdatedMessage(totalKarma: number): string {
    return `${this.inputUserTarget} has ${totalKarma} karma!`;
  }
}
