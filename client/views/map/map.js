Template.map.rendered = function() {

  // INITIATE MAP IF USER IS LOGGED IN
  if (Meteor.userId()) {
    var map = L.map('map').setView([ 45.42891179999999, -75.69028650000001], 13);

    L.tileLayer('http://{s}.tile.cloudmade.com/{key}/60352/256/{z}/{x}/{y}.png', {
      // attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2012 CloudMade',
      key: 'BC9A493B41014CAABB98F0471D759707'
    }).addTo(map);
  }

  // DEPS AUTORUN TO ENABLE THE HOT PUSH OF TIME LINE ENTRIES
  Deps.autorun(function() {
    // SPECIFY THE MODEL THAT WE WISH TO ENABLE HOT PUSH FROM
    Meteor.subscribe("timelines");
    // INITIALIZE THE MARKERS OBJECT
    $.markers = {};

    // IF USER IS LOGGED IN
    if (Meteor.userId()) {
      // GETTING THE TIME LINE ENTREIS FROM MODEL
      // AN ARRAY IS RETURN FROM THIS METHOD
      var details = getTimeEntriesInArray(Meteor.userId());

      // CONSTRUCT THE MARKER DEPENDING ON THE PERPORTIES
      // AVAILABLE IN THE TIME LINE ENTRY OBJECT
      for (var time in details) {
        var obj = details[time];
        if (obj.hasOwnProperty('geometry')) {
          for (var i=0; i<obj.geometry.length; i++) {
            var marker = new L.Marker(new L.LatLng(obj.geometry[i].lat, obj.geometry[i].lon), {
            }).addTo(map).bindPopup(obj.geometry[i].popup);
          }
        } else {
          if (obj.hasOwnProperty('avatar')) {
            var marker = new L.Marker(new L.LatLng(obj.lat, obj.lon), {
              icon: new L.NumberedDivIcon({avatar: obj.avatar})
            }).addTo(map).bindPopup(obj.popup);
          } else {
            var marker = new L.Marker(new L.LatLng(obj.lat, obj.lon), {
            }).addTo(map).bindPopup(obj.popup);
          }
        }
        $.markers[time] = marker;
      }
    }
    // JQUERY THAT WOULD ALWAYS BE ASSOCIATED TO THE MAP MARKERS
    $(function() {
      // ONCE THE DOCUMENT IS READY
      // SET THE CENTER VIEW OF THE MAP
      // OPEN THE POPUP OF THE ACTIVE MARKER
      $(document).ready(function(e){
        var key   = $('#active').attr('key');
        var zoom  = $('#active').attr('zoom');
        map.setView([$.markers[key]._latlng.lat, $.markers[key]._latlng.lng], zoom, {zoom: {animate: true}}, {pan: {animate: true}});
        $.markers[key].openPopup();
        $('#timeline_description').html('<i class="ss-icon">&#x23F2;</i>&nbsp;&nbsp;' + details[key].year);
        $('#memos').html('<i class="ss-icon">&#x23F2;</i>&nbsp;&nbsp;' + details[key].content);
      });
      // SPECIFY THE ON CLICK ACTION OF 
      // A PARTICULAR TIMELINE ENTRY
      $('.timeline_entry').click(function(e) {
        $('#active').removeAttr('id');
        
        var lat  = $(e.target).attr('lat');
        var lon  = $(e.target).attr('lon');
        var zoom = $(e.target).attr('zoom');
        var key  = $(e.target).attr('key');
    
        if (lat && lon) { 
          map.setView([lat, lon], zoom, {zoom: {animate: true}}, {pan: {animate: true}});
        } else {
          map.setView([$.markers[key]._latlng.lat, $.markers[key]._latlng.lng], zoom, {zoom: {animate: true}}, {pan: {animate: true}});
        }
        $(e.target).attr('id', 'active');
        $('#timeline_description').html('<i class="ss-clock"></i>&nbsp;&nbsp;' + details[key].year);
        $('#memos').html('<i class="ss-clock"></i>&nbsp;&nbsp;' + details[key].content);
        
        $.markers[key].openPopup();
      }); 
    });
  });
  
  
}







