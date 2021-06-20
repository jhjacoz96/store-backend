const bcrypt = require('bcrypt');
const authConfig = require('../../config/auth');
const helper = {};

helper.generateHash = async (password) => { 
    const hash = await bcrypt.hash(password, bcrypt.genSaltSync(Number.parseInt(authConfig.rounds)));
    return hash
  }

module.exports = helper;