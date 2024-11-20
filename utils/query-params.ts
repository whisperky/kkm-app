export const objectToQueryParams = (obj: {
  [key: string]: string | string[] | number | boolean | undefined;
}) => {
  const params = Object.entries(obj)
    .filter(([_, value]) => value === 0 || value === false || Boolean(value))
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(
          value?.toString() as string
        )}`
    );

  return params.join("&");
};
