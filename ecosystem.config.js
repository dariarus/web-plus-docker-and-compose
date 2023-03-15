const dotenv = require('dotenv');

dotenv.config({ path: './.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/master',
} = process.env;

module.exports = {
  deploy: {
    production: {
      key: '~/.ssh/id_rsa',
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: 'https://github.com/dariarus/web-plus-docker-and-compose.git',
      path: DEPLOY_PATH,
      ssh_options: [
        "StrictHostKeyChecking=no",
        "PasswordAuthentication=no"
      ],
      'pre-deploy-local': `scp ./.env* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/source && scp ./frontend/.env* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/source/frontend`,
      'post-deploy': 'sudo docker compose build && sudo docker compose down && sudo docker compose up -d',
    },
  },
};