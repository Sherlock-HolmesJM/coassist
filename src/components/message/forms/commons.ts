export const parseInput = (filename: string, value: string) => {
  return value.slice(filename.length, value.length);
};

export const setSplit = (
  split: string,
  splitRef: React.MutableRefObject<HTMLInputElement>
) => {
  if (splitRef.current) splitRef.current.value = split;
};
