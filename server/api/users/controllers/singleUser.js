const singleUser = (req, res, next) => {
  try {
    const result = req.user;

    res.json({
      status: "success",
      code: 200,
      data: {
        result
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = singleUser;
