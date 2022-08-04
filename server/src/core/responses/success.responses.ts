export const sendSuccessResponse = (message: string, result: any) => {
  return {
    message,
    result,
  };
};

export const setFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = file.originalname.split('.')[1];
  callback(null, `${name}-${Date.now()}.${fileExtName}`);
};
