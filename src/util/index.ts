export const capitalize = (value: string) => {
  const list = value.split(" ");
  const newList = list.map((item) => {
    const [first, ...others] = item.split("");
    return first.toUpperCase() + others.join("");
  });
  return newList.join(" ");
};
