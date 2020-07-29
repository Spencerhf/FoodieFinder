var submitBtn = document.getElementById('submitBtn');


                            //This is the function that retrieves
                            //the location id of the city the 
                            //user types in.
function locationIdFunc() {
    submitBtn.addEventListener('click', function() {

        event.preventDefault();
        //document.getElementById('restaurantList').innerHTML = '';

        var searchBar = document.getElementById('searchBar').value;
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://tripadvisor1.p.rapidapi.com/locations/search?location_id=1&limit=20&sort=relevance&offset=0&lang=en_US&currency=USD&units=mi&query=${searchBar}`,
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
        "url": `https://tripadvisor1.p.rapidapi.com/restaurants/list?restaurant_tagcategory_standalone=10591&lunit=mi&restaurant_tagcategory=10591&limit=20&currency=USD&lang=en_US&location_id=${locationId}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
            "x-rapidapi-key": "b920e36c1emsh38fc765f3e3c7dbp10bccfjsne193d091d660"
        }
    } 
     $.ajax(settings).done(function (response) {

        console.log(response);
        var restaurantList = document.getElementById('restaurantList');
        
        for(var i=0; i<response.data.length; i++) {
            if(response.data[i].name == undefined) {
                response.data.pop();
            } else {
                var locationId = response.data[i].location_id;
                var restaurantNames = `
                    <div class="card mb-3 justify-content-center" style="max-width: 540px;">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="${response.data[i].photo.images.medium.url}" class="card-img" alt="Restaurant Imgage">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${response.data[i].name}</h5>
                                    <button class="btn btn-success ${locationId}" onclick="moreRestaurantInfo(${locationId})">Learn More!</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                restaurantList.innerHTML += restaurantNames;
            }
        }
    });
}

                    //This function is checking if the user
                    //clicks on a restaurant and returns
                    //more info about it
function moreRestaurantInfo(locationId) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://tripadvisor1.p.rapidapi.com/restaurants/list?restaurant_tagcategory_standalone=10591&lunit=mi&restaurant_tagcategory=10591&limit=1&currency=USD&lang=en_US&location_id=${locationId}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
            "x-rapidapi-key": "b920e36c1emsh38fc765f3e3c7dbp10bccfjsne193d091d660"
        }
    }
    
    $.ajax(settings).done(function (response) {
        var moreInfoDiv = document.getElementById('moreRestaurantInfo');
        moreInfoDiv.innerHTML = '';
        
        console.log(response.data[1]);

        if(response.data.length > 1) {
            var limitedDes = response.data[1].description.split(" ").splice(0,50).join(" ");
            var restaurantInfo = `
            <div class="card mx-auto" style="width: 22rem;">
                <div class="card-body">
                    <h5 class="card-title">${response.data[1].name}</h5>
                    <img src="${response.data[1].photo.images.medium.url}" class="card-img-top" alt="...">
                    <p class="card-text">${limitedDes}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Address</strong>: ${response.data[1].address}</li>
                    <li class="list-group-item"><strong>City Ranking</strong>: ${response.data[1].ranking}</li>
                    <li class="list-group-item"><strong>Phone Number</strong>: ${response.data[1].phone}</li>
                </ul>
                <div class="card-body">
                    <a href="${response.data[1].website}" class="card-link">Resraurant Website</a>
                </div>
            </div>
            `;
            moreInfoDiv.innerHTML = restaurantInfo;

        } else {
            var limitedDes = response.data[0].description.split(" ").splice(0,50).join(" ");
            var restaurantInfo = `
            <div class="card mx-auto" style="width: 22rem;">
                <div class="card-body">
                    <h5 class="card-title">${response.data[0].name}</h5>
                    <img src="${response.data[0].photo.images.medium.url}" class="card-img-top" alt="...">
                    <p class="card-text">${limitedDes}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Address</strong>: ${response.data[0].address}</li>
                    <li class="list-group-item"><strong>City Ranking</strong>: ${response.data[0].ranking}</li>
                    <li class="list-group-item"><strong>Phone Number</strong>: ${response.data[0].phone}</li>
                </ul>
                <div class="card-body">
                    <a href="${response.data[0].website}" class="card-link">Resraurant Website</a>
                </div>
            </div>
            `;
            moreInfoDiv.innerHTML = restaurantInfo;
        }
    });
}

locationIdFunc();
