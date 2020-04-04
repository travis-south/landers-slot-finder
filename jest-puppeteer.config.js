const dotenv = require('dotenv');

dotenv.config();

const config = {
    launch: {
        headless: process.env.HEADLESS !== 'false',
        dumpio: false,
        devtools: true,
        timeout: 120 * 1000, // 120 secs
        // we are just testing our own local site, so sandbox is not necessary
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
};

if (process.env.LOCAL_SERVER_PORT) {
    config['server'] = {
        command: 'yarn run start --port ' + process.env.LOCAL_SERVER_PORT,
        port: process.env.LOCAL_SERVER_PORT,
    };
}

module.exports = config;
