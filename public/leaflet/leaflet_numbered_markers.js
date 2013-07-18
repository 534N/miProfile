L.NumberedDivIcon = L.Icon.extend({
	options: {
    // EDIT THIS TO POINT TO THE FILE AT http://www.charliecroom.com/marker_hole.png (or your own marker)
    iconUrl: '/img/member.png',
    number: '',
    shadowUrl: null,
    iconSize: new L.Point(25, 41),
		iconAnchor: new L.Point(13, 41),
		popupAnchor: new L.Point(5, -40),
		/*
		iconAnchor: (Point)
		popupAnchor: (Point)
		*/
		className: 'leaflet-div-icon'
	},
 
	createIcon: function () {
		var div 	= document.createElement('div');
		var img 	= this._createImg(this.options['iconUrl']);

		div.appendChild ( img );
		this._setIconStyles(div, 'icon');
		return div;
	},
 
	//you could change this to add a shadow like in the normal marker if you really wanted
	createShadow: function () {
		return null;
	}
});