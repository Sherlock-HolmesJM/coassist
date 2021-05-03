const formatMoney = (amount, currency = '$') => {
  const head = (amount + '').split('');
  let tail = [];

  for (let i = head.length; i > 3; i -= 3)
    tail.push(head.splice(i - 3).join(''));

  tail.push(head.join(''));

  return currency + tail.reverse().join(',');
};

console.log(formatMoney(311100000));
