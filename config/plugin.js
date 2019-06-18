'use strict';

/** @type Egg.EggPlugin */
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.bcrypt = {
  enable: true,
  package: 'egg-bcrypt'
}

exports.jwt = {
  enable: true,
  package: 'egg-jwt',
}
