var submitBtn = document.getElementById('submitBtn');

var resultsContainer = document.getElementById('resultsContainer');

var priceFilter = document.getElementById('priceFilter');


let map;
let service;
let infowindow;


                            //This is the function that retrieves
                            //the location id of the city the 
                            //user types in.
function locationIdFunc() {
    submitBtn.addEventListener('click', function() {
        event.preventDefault();
        var searchBar = document.getElementById('searchBar').value;
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://tripadvisor1.p.rapidapi.com/locations/search?location_id=1&limit=30&sort=relevance&offset=0&lang=en_US&currency=USD&units=km&query=${searchBar}`,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
                "x-rapidapi-key": "5f545a0c82mshb2c03dc9e417f9bp1cfbdejsn37162ac5cefa"
            }
        }
        $.ajax(settings).done(function (response) {
            locationId = response.data[0].result_object.location_id;
            console.log(locationId);
            restaurantList(locationId);
            
        });
    });
}

                            //This function is taking the locationId
                            //and returning restaurant data 
function restaurantList(locationId) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://tripadvisor1.p.rapidapi.com/restaurants/list?restaurant_tagcategory_standalone=10591&lunit=mi&restaurant_tagcategory=10591&limit=10&currency=USD&lang=en_US&location_id=${locationId}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
            "x-rapidapi-key": "5f545a0c82mshb2c03dc9e417f9bp1cfbdejsn37162ac5cefa"
        }
    } 
     $.ajax(settings).done(function (response) {
        
        console.log(response.data);
        
            
            resultsContainer.innerHTML = "";
            
            for(var i=0; i<response.data.length; i++) {
                if(response.data[i].name == undefined) {
                    response.data.pop();
                } 
                else if(priceFilter.value != "") {
                    var restaurantItem = filterPrice(response.data[i]);
                    if(restaurantItem){
                        resultsContainer.appendChild(restaurantItem);
                    }
                }
                else {
                    
                    var restaurantItem = printCard(response.data[i]);
                    resultsContainer.appendChild(restaurantItem);

                }
                    
                
        }
        
        
      
    });

}

/*Initializes Google map for the restaurant location when button is clicked*/
function initMap(coords, response) {
    
    infowindow = new google.maps.InfoWindow();
    
    map = new google.maps.Map(document.getElementById("map"), {
        center: coords,
        zoom: 14,
        gestureHandling: 'greedy'
      });

    var request = {
        query: response,
        fields: ["name", "formatted_address", "geometry"]
      };
      service = new google.maps.places.PlacesService(map);
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
          map.setCenter(results[0].geometry.location);
        }
      });
    
    
}

/*Creates marker for the Google map and places it on restaurant locationj */
function createMarker(place) {
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location
    });
    google.maps.event.addListener(marker, "click", () => {
      infowindow.setContent("<h3>"+ place.name + "</h3>" + "<p>" + place.formatted_address + "</p>");
      infowindow.open(map);
    });
  }

/* Filters the restaurants listings by price level string("$$$") using 
   the price filter dropdown menu*/
function filterPrice(response) {
    let card = null;
    if(priceFilter.value == response.price_level) {
        card = printCard(response);
    }
    
    return card;
    
    
}

/*Creates card containing all info about each restaurant */
function printCard(response) {
    var cardElement = document.createElement('div');
    cardElement.className = "card mb-3 justify-content-center";
    cardElement.style.maxWidth = "540px";

    var row = document.createElement('div');
    row.className = "row no-gutters";

    var pic = document.createElement('div');
    pic.className = "col-md-4";

    var image = `<img src="${response.photo.images.medium.url}" class="card-img" alt="Restaurant Image">`;

    var info = document.createElement('div');
    info.className = "col-md-8";

    var cardBody = document.createElement('div');
    cardBody.className = "card-body";
    
    cardInfo = `<h5>${response.name}</h5>
                <h6>${response.address}</h6>
                <h6>Phone: ${response.phone}</h6>
                <p>${response.description}</h6>
                <p>Price: ${response.price_level} </p>
                <p>Rating: ${response.rating} </p>
                `;

    var mapButton = document.createElement('button');
    mapButton.className = "btn"
    mapButton.id = response.latitude;
    mapButton.name = response.longitude;
    mapButton.style.backgroundColor = "rgb(216,56,38)";
    mapButton.innerHTML = "Show on Map";

    mapButton.addEventListener('click', function() {
        var latitude = parseFloat(this.id);
        var longitude = parseFloat(this.name);
        var name = this.parentNode.firstChild.innerHTML;
        console.log(this.parentNode.firstChild.innerHTML);

        var latlong = { lat: latitude, lng: longitude };

        initMap(latlong, name);

    })

    cardBody.insertAdjacentHTML("beforeend", cardInfo); 
    cardBody.appendChild(mapButton);
    info.appendChild(cardBody);

    pic.insertAdjacentHTML("beforeend", image);

    row.appendChild(pic);
    row.appendChild(info);

    cardElement.appendChild(row);

    return cardElement;

}

//locationIdFunc();

