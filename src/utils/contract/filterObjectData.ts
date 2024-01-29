export const filterObjectData = (response: any[]) => {
  const resultObject: Record<string, any> = {};

  response.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!["_hex", "_isBigNumber"].includes(key)) {
        resultObject[key] = item[key];
      }
    });
  });

  return resultObject;
};
