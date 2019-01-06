import CommandAddKarma from './commandAddKarma';
import SlackService from '../services/slackService';

export default class CommandSubtractKarma extends CommandAddKarma {
    public constructor(event: any) {
        super(event);

        this.regex = /\s*(\S+)--(\s|$)/;
    }

    protected async doProcess() : Promise<void> {
        const totalKarma = await this.addKarma(-1);
        SlackService.reply(this.getKarmaUpdatedMessage(totalKarma), this.channel);
    }
}