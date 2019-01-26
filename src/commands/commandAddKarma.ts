

import * as _ from 'lodash';
import Command from './command';
import SlackService from '../services/slackService';
import { UserModel, User } from '../db/models/user';

export default class CommandAddKarma extends Command {
  protected userTarget: string;
  protected channel: string;
  protected regex: RegExp;

  public constructor(event: any) {
    super(event);

    this.channel = this.event.channel;
    this.regex = /\s*(\S+)\s?\+\+(\s|$)/;
    this.userTarget = '';
  }

  protected async canProcess(): Promise<boolean> {
    let match = this.regex.exec(this.event.text);
    if (match) {
      this.userTarget = match[1];
      return true;
    }
    return false;
  }

  protected async doProcess(): Promise<void> {
    const userIdSource = this.event.user;
    const userIdTarget = await this.getUserIdTarget();

    console.log(`${userIdSource} giving karma to ${userIdTarget}`)
    let totalKarma;
    let karmaUpdatedMessage;
    if (userIdTarget === userIdSource) {
      totalKarma = await this.addKarma(userIdTarget, -1);
      karmaUpdatedMessage = `Cheater! ${this.getKarmaUpdatedMessage(totalKarma)}`;
    } else {
      totalKarma = await this.addKarma(userIdTarget, 1);
      karmaUpdatedMessage = this.getKarmaUpdatedMessage(totalKarma);
    }
    SlackService.reply(karmaUpdatedMessage, this.channel);
  }

  protected async getUserIdTarget(): Promise<string> {
    // If the user looks like '<@UF6S35Y8G>', extract 'UF6S35Y8G' which is the user id.
    // This is the format when you call someone out with a command like '@user ++'
    const match = /\<\@(\w*)\>/.exec(this.userTarget);
    if (match) {
      return match[1];
    }

    // Try to match the target with a user to get their id, but otherwise just return the userTarget 
    // as the id
    const userTargetLower = this.userTarget.toLowerCase();
    const users = await SlackService.getUsers();
    const user = _.find(users, (u) => u.name.toLowerCase() === userTargetLower)
    return user ? user.id : this.userTarget;
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
    return `${this.userTarget} has ${totalKarma} karma!`;
  }
}
