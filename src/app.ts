require('dotenv').config();

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as WebSocket from 'ws';
import * as _ from 'lodash';

//My Services
import SlackService from './services/slackService'
import MongoService from './services/mongoDBService';

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

async function launchWebSocket() {
  const url = await SlackService.getConnectionUrl();
  ws = new WebSocket(url);
  ws.on('message', (res: any) => {
    const event = JSON.parse(res);
    const msg = event.text;
    const channel = event.channel;
    commandCheck(msg, channel);
  });
}

function commandCheck(msg: string, channel: string) {
  let regex = /\s*(\S+)\+\+(\s|$)/;
  let match = regex.exec(msg);

  if (match) {
    const user = match[1];
    updateKarma(user, channel, true);
    return;
  }

  regex = /\s*(\S+)--(\s|$)/;
  match = regex.exec(msg);

  if (match) {
    const user = match[1];
    updateKarma(user, channel);
    return;
  }
}

async function updateKarma(user: string, channel: string, isAdd?: boolean) {
  const query = { recipient: user };
  let totalKarma;
  const userDocument = await MongoService.find(query);

  if (userDocument) {
    totalKarma = userDocument.karma;
    totalKarma = isAdd ? ++totalKarma : --totalKarma;
    MongoService.update(query, { karma: totalKarma });
  } else {
    totalKarma = isAdd ? 1 : -1;
    MongoService.insertMany([
      {
        recipient: user,
        karma: totalKarma
      }
    ]);
  }

  const reply = `${user} has ${totalKarma} karma!`;
  SlackService.reply(reply, channel);
}

launchWebSocket();
