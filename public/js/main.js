// CUSTOM JS FILE //
var map; // global map variable
var markers = []; // array to hold map markers

function init() {
  
  // set some default map details, initial center point, zoom and style
  var mapOptions = {
    center: new google.maps.LatLng(40.74649,-74.0094), // NYC
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  // create the map and reference the div#map-canvas container
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  
  // get the animals (ajax) 
  // and render them on the map
  renderPlaces();
}



// when the addForm is submitted (with a new animal), the below runs
jQuery("#addForm").submit(function(e){

	// first, let's pull out all the values
	// the name form field value
	var date = jQuery("#date").val();
	var tags = jQuery("#tags").val();
	var story = jQuery("#story").val();
	var url = jQuery("#url").val();
	var location = jQuery("#location").val();

	// make sure we have a location
	if(!location || location=="") return alert('We need a location!');
      
	// POST the data from above to our API create route
  jQuery.ajax({
  	url : '/api/create',
  	dataType : 'json',
  	type : 'POST',
  	// we send the data in a data object (with key/value pairs)
  	data : {
  		date : date,
  		tags : tags,
  		story: story,
  		url : url,
  		location : location
  	},
  	success : function(response){
  		if(response.status=="OK"){
	  		// success
	  		console.log(response);
	  		// re-render the map
	  		renderPlaces();
	  		// now, clear the input fields
	  		jQuery("#addForm input").val('');
  		}
  		else {
  			alert("something went wrong 1");
  		}
  	},
  	error : function(err){
  		// do error checking
  		alert("something went wrong 2");
  		console.error(err);
  	}
  }); 

	// prevents the form from submitting normally
  e.preventDefault();
  return false;
});

// get Animals JSON from /api/get
// loop through and populate the map with markers
var renderPlaces = function() {
	var infowindow =  new google.maps.InfoWindow({
	    content: ''
	});

	jQuery.ajax({
		url : '/api/get',
		dataType : 'json',
		success : function(response) {

			console.log(response);
			found = response.object;
			// first clear any existing markers, because we will re-add below
			clearMarkers();
			markers = [];

			// now, loop through the animals and add them as markers to the map
			for(var i=0;i<found.length;i++){


				var latLng = {
					lat: found[i].location.geo[1], 
					lng: found[i].location.geo[0]
				}

				// make and place map maker.
				var marker = new google.maps.Marker({
				    map: map,
				    position: latLng,
				    title : found[i].story
				});

				bindInfoWindow(marker, map, infowindow, '<img class="url" src="'+found[i].url+'"> ' + '<b>'+ found[i].story + '</b>');
				
				// keep track of markers
				markers.push(marker);

				console.log("once through");
			}

			// now, render the object image/data
			renderFound(response.object);

		}
	})
};

// // edit form button event
// // when the form is submitted (with a new animal edit), the below runs
// jQuery("#editForm").submit(function(e){

// 	// first, let's pull out all the values
// 	// the name form field value
// 	var name = jQuery("#edit-name").val();
// 	var age = jQuery("#edit-age").val();
// 	var weight = jQuery("#editWeight").val();
// 	var tags = jQuery("#edit-tags").val();
// 	var breed = jQuery("#edit-breed").val();
// 	var url = jQuery("#edit-url").val();
// 	var location = jQuery("#edit-location").val();
// 	var id = jQuery("#edit-id").val();

// 	// make sure we have a location
// 	if(!location || location=="") return alert('We need a location!');
     
//   console.log(id);
      
// 	// POST the data from above to our API create route
//   jQuery.ajax({
//   	url : '/api/update/'+id,
//   	dataType : 'json',
//   	type : 'POST',
//   	// we send the data in a data object (with key/value pairs)
//   	data : {
//   		name : name,
//   		age : age,
//   		tags : tags,
//   		breed : breed,
//   		weight: weight,
//   		url : url,
//   		location : location
//   	},
//   	success : function(response){
//   		if(response.status=="OK"){
// 	  		// success
// 	  		console.log(response);
// 	  		// re-render the map
// 	  		renderPlaces();
// 	  		// now, close the modal
// 	  		$('#editModal').modal('hide')
// 	  		// now, clear the input fields
// 	  		jQuery("#editForm input").val('');
//   		}
//   		else {
//   			alert("something went wrong");
//   		}
//   	},
//   	error : function(err){
//   		// do error checking
//   		alert("something went wrong");
//   		console.error(err);
//   	}
//   }); 

// 	// prevents the form from submitting normally
//   e.preventDefault();
//   return false;
// });

// binds a map marker and infoWindow together on click
var bindInfoWindow = function(marker, map, infowindow, html) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(html);
        infowindow.open(map, marker);
    });
}

function renderFound(found){

	// first, make sure the #animal-holder is empty
	jQuery('#found-holder').empty();

	// loop through all the animals and add them in the animal-holder div
	for(var i=0;i<found.length;i++){
		var htmlToAdd = '<div class="col-md-4 foundobject" id="individualpost">'+
			'<img class="url" src="'+found[i].url+'"> </br> </br>'+
				// '<li>Location: <span class="location">'+found[i].location.date+'</span></li>'+
				'<span class="story">'+found[i].story+'</span>'+
				// '<li>Tags: <span class="tags">'+found[i].tags+'</span></li>'+
				'<span class="hide id">'+found[i]._id+'</span'+
			// '<button type="button" id="'+found[i]._id+'" onclick="deleteAnimal(event)">Delete Animal</button>'+
			// '<button type="button" data-toggle="modal" data-target="#editModal"">Edit Animal</button>'+
		'</div>';

		console.log(htmlToAdd);

		jQuery('#found-holder').prepend(htmlToAdd);

	}
}

// jQuery('#editModal').on('show.bs.modal', function (e) {
//   // let's get access to what we just clicked on
//   var clickedButton = e.relatedTarget;
//   // now let's get its parent
// 	var parent = jQuery(clickedButton).parent();

//   // now, let's get the values of the pet that we're wanting to edit
//   // we do this by targeting specific spans within the parent and pulling out the text
//   var name = $(parent).find('.name').text();
//   var age = $(parent).find('.age').text();
//   var weight = $(parent).find('.weight').text();
//   var tags = $(parent).find('.tags').text();
//   var breed = $(parent).find('.breed').text();
//   var url = $(parent).find('.url').attr('src');
//   var location = $(parent).find('.location').text();
//   var id = $(parent).find('.id').text();

//   // now let's set the value of the edit fields to those values
//  	jQuery("#edit-name").val(name);
// 	jQuery("#edit-age").val(age);
// 	jQuery("#editWeight").val(weight);
// 	jQuery("#edit-tags").val(tags);
// 	jQuery("#edit-breed").val(breed);
// 	jQuery("#edit-url").val(url);
// 	jQuery("#edit-location").val(location);
// 	jQuery("#edit-id").val(id);

// })


// function deleteAnimal(event){
// 	var targetedId = event.target.id;
// 	console.log('the animal to delete is ' + targetedId);

// 	// now, let's call the delete route with AJAX
// 	jQuery.ajax({
// 		url : '/api/delete/'+targetedId,
// 		dataType : 'json',
// 		success : function(response) {
// 			// now, let's re-render the animals

// 			renderPlaces();

// 		}
// 	})

// 	event.preventDefault();
// }

function clearMarkers(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null); // clears the markers
  }	
}

// when page is ready, initialize the map!
google.maps.event.addDomListener(window, 'load', init);


window.addEventListener('load',init);






