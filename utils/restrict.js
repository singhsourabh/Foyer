module.exports = data => {
  ["zealID", "isPaid", "paymentMode"].forEach(e => delete data[e]);
  return data;
};
