var submitBtn = document.getElementById('submitBtn');


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
                "x-rapidapi-key": "b920e36c1emsh38fc765f3e3c7dbp10bccfjsne193d091d660"
            }
        }
        $.ajax(settings).done(function (response) {
            locationId = response.data[0].result_object.location_id;
            console.log(locationId);
            restaurantList(locationId);
        });
    })
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
            "x-rapidapi-key": "b920e36c1emsh38fc765f3e3c7dbp10bccfjsne193d091d660"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response.data);
    });
}

locationIdFunc();
