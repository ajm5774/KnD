# Karma and Dragons
Commands
* \<user\>++: Adds 1 karma to the user
* \<user\>--: Subtracts 1 karma from the user

## Contributing
### Project Setup
1. Clone the repo `git clone git@github.com:rbaxter08/KnD.git`
1. Install dependencies `yarn`
1. Setup MongoDB
    * Download and install [Mongodb](https://www.mongodb.com/download-center/community)
    * Add bin folder to the path (ex. C:\Program Files\MongoDB\Server\4.0\bin)
    * Add the connection string to .env file with `MONGO_CONNECTION_STRING=mongodb://localhost`
1. Setup Slack
    * Request permissions to be added to [dev workspace](https://karmaanddragons.slack.com). This will add you as a collaborator for the [slack app](https://api.slack.com/apps/AF6MPM22U)
    * Add the bot access token to .env file with `SLACK_TOKEN=<bot_access_token>`. The access token can be found under **Features > OAuth & Permissions**
1. Start the dev server `yarn start`

### Making Changes
1. Create a new branch
`git checkout -b <your_branch_name>` in the format `<issue_id>-<description>` (ex. "8-hot-build")
1. After you have finished making your changes commit them.
`git commit -m "<your_commit_message>`"
1. Push your changes to github
`git push origin <your_branch_name>`
1. Create pull request 
    * From [Github](https://github.com/rbaxter08/KnD/pulls) create a Pull Request from your branch into master
    * Tag a reviewer
    * Wait for it to be reviewed and address feedback before merging
