/**
 * This script sets up integration to the Real Time Messaging API https://api.slack.com/rtm
 * 
 * Add commands to the eventTypeToCommands dictionary to add additional processing for specific 
 * event types.
 */

import * as WebSocket from 'ws';

//My Services
import SlackService from './services/slackService'

//Commands
import Command from './commands/command';
import CommandAddKarmaMessage from './commands/commandAddKarmaMessage';
import CommandSubtractKarmaMessage from './commands/commandSubtractKarmaMessage';

import CommandAddKarmaReaction from './commands/commandAddKarmaReaction';
import CommandSubtractKarmaReaction from './commands/commandSubtractKarmaReaction';

const eventTypeToCommands: { [id: string]: any[] } = {
  'message': [CommandAddKarmaMessage, CommandSubtractKarmaMessage],
  'reaction_added': [CommandAddKarmaReaction, CommandSubtractKarmaReaction],
};

function getCommands(event: any): Command[] {
  if (event.type in eventTypeToCommands) {
    return eventTypeToCommands[event.type].map(cls => new cls(event));
  }

  return [];
}

export async function start() {
  const url = await SlackService.getRtmUrl();
  const ws = new WebSocket(url);
  ws.on('message', (res: string) => {
    const event = JSON.parse(res);

    if (event.bot_id) {
      return; // Lets not try parsing messages from bots
    }

    getCommands(event).forEach(cmd => cmd.process());
  });
}