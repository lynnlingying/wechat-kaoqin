const mysql = require('mysql');
const pify = require('pify');
const { kqdb} = require('../config.js');
const pool = mysql.createPool({
  connectionLimit: 5,
  host: kqdb.host,
  user: kqdb.user,
  password: kqdb.pass,
  database: kqdb.db,
  charset: kqdb.char
});

module.exports = {
  query: pify(pool.query.bind(pool))
};