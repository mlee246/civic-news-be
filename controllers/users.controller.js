const { getUsers } = require("../models/users.models");

exports.findUsers = (req, res, next) => {
  getUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};
