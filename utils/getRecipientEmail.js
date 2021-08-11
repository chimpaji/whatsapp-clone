const getRecipientEmail = (users, userLoggedIn) => {
  return users?.filter((email) => email !== userLoggedIn?.email)[0];
};

export default getRecipientEmail;
