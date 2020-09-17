window.addEventListener('load', () => {
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimezone = document.querySelector('.location-timezone');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            //console.log(position);
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&
            exclude=hourly,daily&appid=fdcd0a7fb7ae9121a4eb6f2fe2ba4026`;

            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    // const [temp, weather] = data.current;
                    //Set DOM Elements from the API
                    // temperatureDegree.textContent = temp;
                    // temperatureDescription.textContent = weather;
                    // locationTimezone.textContent = data.timezone;
                });
        });

    }
    // else {
    //     console.log("you can not fount becouse some of reaesons");
    // }
});