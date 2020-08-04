var submitBtn = document.getElementById('submitBtn');


                            //This is the function that retrieves
                            //the location id of the city the 
                            //user types in.
function locationIdFunc() {
    submitBtn.addEventListener('click', function() {

        event.preventDefault();
        document.getElementById('resultsContainer').innerHTML = '';

        var searchBar = document.getElementById('searchBar').value;
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://tripadvisor1.p.rapidapi.com/locations/search?location_id=1&limit=10&sort=relevance&offset=0&lang=en_US&currency=USD&units=km&query=${searchBar}`,
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
        "url": `https://tripadvisor1.p.rapidapi.com/restaurants/list?restaurant_tagcategory_standalone=10591&lunit=mi&restaurant_tagcategory=10591&limit=7&currency=USD&lang=en_US&location_id=${locationId}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
            "x-rapidapi-key": "b920e36c1emsh38fc765f3e3c7dbp10bccfjsne193d091d660"
        }
    } 
     $.ajax(settings).done(function (response) {
        console.log(response.data);


        var resultsContainer = document.getElementById('resultsContainer');
        console.log(response.data[0]);
        
        for(var i=0; i<response.data.length; i++) {
            if(response.data[i].name == undefined) {
                response.data.pop();
            } else {
                var restaurantNames = `
                    <div class="card mb-3 justify-content-center" style="max-width: 540px;">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="${response.data[i].photo.images.medium.url}" class="card-img" alt="Restaurant Imgage">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${response.data[i].name}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                resultsContainer.innerHTML += restaurantNames;
            }
                
            
    }
    });
}

locationIdFunc();
