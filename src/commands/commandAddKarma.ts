import * as _ from 'lodash';
import Command from './command';
import SlackService from '../services/slackService';
import MongoService from '../services/mongoDBService';

export default class CommandAddKarma extends Command {
    protected userTarget: string;
    protected channel: string;
    protected regex: RegExp;

    public constructor(event: any) {
        super(event);

        this.channel = this.event.channel;
        this.regex = /\s*(\S+)\+\+(\s|$)/;
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

    protected async doProcess() : Promise<void> {
        const userSource = await this.getUsernameSource(this.event.user); // user is actually user id

        let totalKarma;
        let karmaUpdatedMessage;
        if (this.userTarget === userSource) {
            totalKarma = await this.addKarma(-1);
            karmaUpdatedMessage = `Cheater! ${this.getKarmaUpdatedMessage(totalKarma)}`;
        } else {
            totalKarma = await this.addKarma(1);
            karmaUpdatedMessage = this.getKarmaUpdatedMessage(totalKarma);
        }
        SlackService.reply(karmaUpdatedMessage, this.channel);
    }

    protected async getUsernameSource(userId: string): Promise<string> {
        const users = await SlackService.getUsers()
        const user = _.find(users, (u) => u.id === userId)
        return user.name;
    }

    protected async addKarma(amount: number): Promise<number> {
        const query = { recipient: this.userTarget };
        let totalKarma;
        const userDocument = await MongoService.find(query);

        if (userDocument) {
            totalKarma = userDocument.karma;
            totalKarma += amount;
            MongoService.update(query, { karma: totalKarma });
        } else {
            totalKarma = amount;
            MongoService.insertMany([{
                recipient: this.userTarget,
                karma: totalKarma
            }]);
        }

        return totalKarma;
    }

    protected getKarmaUpdatedMessage(totalKarma: number): string {
        return `${this.userTarget} has ${totalKarma} karma!`;
    }
}
