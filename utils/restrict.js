module.exports = data => {
  return (({ name, email, admissionNo, mobile }) => ({
    name,
    email,
    admissionNo,
    mobile
  }))(data);
};
