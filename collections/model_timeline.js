timelines = new Meteor.Collection('timelines')

timelines.allow({
	insert: function(userId, entry) {
		return false;
	},
	update: function(userId, entry) {
		return true;
	},
	remove: function(userId, entry) {
		return entry.owner === userId && sending(entry) === 0;
	}
})

Meteor.methods({
	createEntry: function(options) {
		options = options || {};
		if (options.content.length > 2000) throw new Meteor.Error(413, 'Description too long');
		if (!this.userId) throw new Meteor.Error(403, "You must be logged in");
		// RESTORE THE ACTIVE STATE TO FALSE ON ALL 
		// TIME ENTRIES BEFORE UPDATE THE PARTICULAR ONE
		if (options.active == 'YES') {
			timelines.update( 
				{ 	
					$and: [
						{ owner: 	options.owner 	},
						{ active: 	'YES'			}
					]
				},
				{
					$set: { active: 	'NO'		}
				}
			);
		}

		timelines.insert({
			owner: 		options.owner,
			year: 		options.year,
			month: 		options.month,
			day: 		options.day,
			lat: 		options.lat,
			lon: 		options.lon,
			zoom: 		options.zoom,
			center_lat: options.center_lat,
			center_lon: options.center_lon,
			active: 	options.active,
			popup: 		options.popup,
			content: 	options.content
		});
	},
	updateActiveEntry: function(options) {
		options = options || {};
		timelines.update(
		{
			$and: 
			[
				{ owner: 	options.owner 	}, 
				{ year: 	options.year  	},
				{ month: 	options.month 	},
				{ day: 		options.day 	}
			],
		},
		{
			$set: 
				{ active: 	options.active 	}
		});
	}
});

getMostRecentEntry = function(userId) {
	return timelines.findOne({owner: userId}, {sort: {year: -1} });
}

getTimeEntries = function(userId) {
	return timelines.find({owner: userId}, {sort: {year: -1} });
}

getTimeEntriesInArray = function(userId) {
	var tArray = [];
	var timeEntries = timelines.find({owner: userId}, {sort: {year: -1} });;

	timeEntries.forEach(function(entry) {
        tArray[entry.year] = entry;
    });

    return tArray;
}