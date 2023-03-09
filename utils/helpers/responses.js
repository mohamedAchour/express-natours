const serverResponse = {
  sendSuccess: (res, message, data = null, results = null) => {
    const responseMessage = {
      code: message.code ? message.code : 500,
      status: 'success',
      ...(results !== null && { results }),
      ...(data !== null && { data: { [message.title]: data } }),
    };
    return res.status(message.code).json(responseMessage);
  },
  sendError: (res, error) => {
    const responseMessage = {
      code: error.code ? error.code : 500,
      status: 'fail',
      message: error.message,
    };
    return res.status(error.code ? error.code : 500).json(responseMessage);
  },
};

module.exports = serverResponse;
