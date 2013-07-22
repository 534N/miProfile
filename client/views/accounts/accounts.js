Template.user_loggedout.events({
	"click #login": function(e, tmpl){
		Meteor.loginWithGithub({
				requestPermissions: ['user', 'public_repo']
		}, function (err) {
			if(err) {
				//error handling
			} else {
				//show an alert
				//alert('logged in');
			}
		});
	}
});

Template.user_loggedin.events({
	"click #logout": function(e, tmpl) {
		Meteor.logout(function(err) {
			if(err) {
				//sow err message
			} else {
				//show alert that says logged out
				//alert('logged out');
			}
		});
	}
});

Template.user_loggedout.events({
	'mouseenter .login_options': function(e, template) {
		var type = $(e.target).attr('type');
		$('#login_info').html(type);
	},
	'mouseout .login_options': function(e, template) {
		$('#login_info').html('');
	}
});