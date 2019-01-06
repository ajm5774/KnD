require('dotenv').config();

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as WebSocket from 'ws';

//My Services
import SlackService from './services/slackService'

//Commands
import Command from './commands/command';
import CommandAddKarma from './commands/commandAddKarma';
import CommandSubtractKarma from './commands/commandSubtractKarma';

let ws;
let app = express();
let port = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.listen(port, () => {
  console.log('Listening on port ' + port);
});


function getCommands(event: any): Command[] {
  const eventTypeToCommands: { [id: string] : any[] } = {
    'message': [CommandAddKarma, CommandSubtractKarma],
  };

  if (event.type in eventTypeToCommands) {
    return eventTypeToCommands[event.type].map(cls => new cls(event));
  }

  return [];
}

async function launchWebSocket() {
  const url = await SlackService.getConnectionUrl();
  ws = new WebSocket(url);
  ws.on('message', (res: any) => {
    const event = JSON.parse(res);

    if(event.bot_id) {
      return; // Lets not try parsing messages from bots
    }

    getCommands(event).forEach(cmd => cmd.process());
  });
}

launchWebSocket();
