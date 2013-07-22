Accounts.onCreateUser(function (options, user) {
  var accessToken = user.services.github.accessToken,
      result,
      profile;

  result = Meteor.http.get("https://api.github.com/user", {
		headers: {"User-Agent": "Meteor/1.0"},

    params: {
      access_token: accessToken
    }
  });

  if (result.error)
    throw result.error;

  profile = _.pick(result.data,
    "name",  
	  "login",
    "avatar_url",
    "url",
    "company",
    "blog",
    "location",
    "email",
    "bio",
    "html_url");

  user.profile = profile;

  return user;
});