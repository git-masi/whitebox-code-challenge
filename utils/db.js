require('dotenv').config();
const configKnex = require('knex');

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const knex = configKnex({
  client: 'mysql2',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
});

async function closeDbConnection() {
  await knex.destroy();
}

function getDataByClientId(id) {
  return knex
    .select('start_weight', 'end_weight', 'zone', 'rate', 'shipping_speed')
    .from('rates')
    .where('client_id', '=', id);
}

module.exports = { closeDbConnection, getDataByClientId };
