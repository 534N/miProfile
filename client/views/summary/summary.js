Template.summary.firstname = function() {
	var obj 		= getUserProfile(Meteor.userId());
	var fullname 	= obj.profile.name;
	var firstname 	= fullname.split(" ")[0];
	return firstname.toUpperCase();
},
Template.summary.lastname = function() {
	var obj 		= getUserProfile(Meteor.userId());
	var fullname 	= obj.profile.name;
	var lastname 	= fullname.split(" ")[1];

	return lastname.toUpperCase();
},
Template.summary.location = function() {
	var obj 		= getUserProfile(Meteor.userId());
	var location 	= obj.profile.location;
	if (location) {
		return location.toUpperCase();
	} else {
		return null;
	}
	
},
Template.summary.html_url = function() {
	var obj 		= getUserProfile(Meteor.userId());
	var html_url 	= obj.profile.html_url;

	return html_url.toUpperCase();
},
Template.summary.avatar_url = function() {
	var obj 		= getUserProfile(Meteor.userId());
	var avatar_url 	= obj.profile.avatar_url;

	return avatar_url;
},
Template.summary.email = function() {
	var obj 	= getUserProfile(Meteor.userId());
	var email 	= obj.profile.email;

	return email.toUpperCase();
}
