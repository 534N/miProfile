Template.timeline.events({
	'mouseenter .timeline_entry': function(e, template) {
		$(e.target).find('.editme').css('opacity', 1);
	},
	'mouseout .timeline_entry': function(e, template) {
		$(e.target).find('.editme').css('opacity', 0);
	}
});

Template.timeline.timeEntries = function() {
	return getTimeEntries(Meteor.userId());
},
Template.timeline.zoom = function() {
	return this.zoom;
},
Template.timeline.year = function() {
	return this.year;
},
Template.timeline.timeEntry = function() {
	var display_string = this.year;
	if (this.month) display_string += ' ' + this.month;
	if (this.day)	display_string += ' ' + this.day;
	return display_string;
},
Template.timeline.active = function() {
	if (this.active == 'YES') {
		return 'id=active';
	}
}


Template.timeline_modal.events({
	'keypress #event-popup': function(e, template) {
		var year 		= $('#year').val();
		var location 	= $('#event-location').val();
		var popup		= $('#event-popup').val();

		if (popup.length == 1) {
			$('#event-popup').removeClass('red');
			$('.warning').html('');
			$('.warning').css('display', 'none');

			geocoder.geocode( { 'address': location}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					$('#event-location').removeClass('red');
					$('.warning').html('');
					$('.warning').css('display', 'none');

					if (year.length == 4) {
						$('#year').removeClass('red');
						$('.warning').css('display', 'none');
						$('.warning').html('');
						
					} else {
						$('#year').addClass('red');
						$('.warning').html('Please enter a valid year');
						$('.warning').css('display', 'block');
					}
					
				} else {
					$('#event-location').addClass('red');
					$('.warning').html('Geocoding failed: ' + status);
					$('.warning').css('display', 'block');
				}
			});
		}
	},
	'keypress #event-description': function (e, template) {
		var year 		= $('#year').val();
		var location 	= $('#event-location').val();
		var popup		= $('#event-popup').val();
		var content		= $('#event-description').val();

		if (content.length == 1) {
			geocoder.geocode( { 'address': location}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					$('#event-location').removeClass('red');
					$('.warning').html('');
					$('.warning').css('display', 'none');

					if (year.length == 4) {
						if (popup.length > 0) {
							$('.submit').removeAttr('disabled');
							$('#year').removeClass('red');
							$('.warning').css('display', 'none');
							$('.warning').html('');
						} else {
							$('#event-popup').addClass('red');
							$('.warning').html('You gonna say something');
							$('.warning').css('display', 'block');
						}

					} else {
						$('#year').addClass('red');
						$('.warning').html('Please enter a valid year');
						$('.warning').css('display', 'block');
					}
					
				} else {
					$('#event-location').addClass('red');
					$('.warning').html('Geocoding failed: ' + status);
					$('.warning').css('display', 'block');
				}
			});
		}
	},
	'blur #year': function(e, template) {
		var year = $('#year').val();
		if (year.length == 4) {
			$('#year').removeClass('red');
			$('.warning').css('display', 'none');
		} else {
			$('#year').addClass('red');
			$('.warning').html('Please enter a valid year');
			$('.warning').css('display', 'block');
		}
	},
	'blur #event-location': function(e, template) {
		var location 	= $('#event-location').val();
		geocoder.geocode( { 'address': location}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				$('#event-location').removeClass('red');
				$('.warning').css('display', 'none');
			} else {
				$('#event-location').addClass('red');
				$('.warning').html('Geocoding failed: ' + status);
				$('.warning').css('display', 'block');
			}
		});
	},
	'click .submit': function(e, template) {
		var month		= $('#month').val();
		var day 		= $('#day').val();
		var zoom		= $('#zoom').val();
		var year 		= $('#year').val();
		var location 	= $('#event-location').val();
		var popup		= $('#event-popup').val();
		var description = $('#event-description').val();
		var active 		= $('#active-checkbox').prop('checked');
		var active_checked = 'NO';

		if (active) {
			active_checked = 'YES';
		}
		geocoder.geocode( { 'address': location}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var position = results[0].geometry.location;
				var lat = position.jb;
				var lon = position.kb;

				Meteor.call('createEntry', {
					owner: 		Meteor.userId(),
					year: 		year,
					month: 		month,
					day: 		day,
					zoom: 		zoom,
					lat: 		lat,
					lon: 		lon,
					center_lat: lat,
					center_lon: lon,
					active: 	active_checked,
					popup: 		popup,
					content: 	description
				}, function (error, entry) {
					if (typeof(error) != 'undefined') {
						$('.warning').html('Problem writing the record: ' + error);
						$('.warning').css('display', 'block');
					} else {
						$('#new-timeEntry').modal('hide');
						$('#year').removeAttr('value');
						$('#month').removeAttr('value');
						$('#day').removeAttr('value');
						$('#zoom').attr('value', '13');
						$('#event-location').removeAttr('value');
						$('#event-popup').removeAttr('value');
						$('#event-description').removeAttr('value');
					}
				});

				// MAKE SURE THERE IS AN ACTIVE ENTRY
				if (!timelines.findOne({
					$and: [
						{ owner: 	Meteor.userId() },
						{ active: 	'YES' 			}
					]
				})) {
					var c = getMostRecentEntry(Meteor.userId());
					Meteor.call('updateActiveEntry', {
						owner: 	c.owner,
						year: 	c.year,
						month: 	c.month,
						day: 	c.day,
						active: 'YES'
					});
				}


			} else {
				$('#event-location').addClass('red');
				$('.warning').html('Geocoding failed: ' + status);
				$('.warning').css('display', 'block');
			}
		});
	}


});