const singleUser = (req, res, next) => {
  try {
    const result = req.user;

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = singleUser;
