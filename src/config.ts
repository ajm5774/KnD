const config = <any>{
    default: {},
    development: {
        mongo: {
            connectionString: "localhost:5000",
        },
        slack: {},
    },
    production: {
        mongo: {
            connectionString: process.env.MONGO_CONNECTION_STRING,
        },
        slack: {
            connectionToken: process.env.SLACK_TOKEN
        },
    },
};
let env = <string>process.env.NODE_ENV;
export default Object.assign({}, config.default, config[env]);