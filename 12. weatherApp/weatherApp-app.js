window.addEventListener('load', () => {
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let temperatureSection = document.querySelector('.temperature');
    const temperatureSpan = document.querySelector('.temperature span');
    let locationTimezone = document.querySelector('.location-timezone');
    let weatherIcon = document.querySelector('.weatherIcon');

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
                    console.log(data.current);
                    const { temp, weather } = data.current;
                    //Set DOM Elements from the API

                    // change temperature to Celsius/Farenheit
                    // Convert from Kelvin to Fahrenheit => ℉=((K-273.15)*1.8)+32
                    // Convert from Kelvin to Celsius => ℃=K-273.15
                    temperatureDegree.textContent = temp - 273.15;
                    let Celsius = temp - 273.15
                    let Fahrenheit = ((temp - 273.15) * 1.8) + 32
                    temperatureSection.addEventListener('click', () => {
                        if (temperatureSpan.textContent === "℉") {
                            temperatureSpan.textContent = "℃";
                            temperatureDegree.textContent = Celsius;
                        } else {
                            temperatureSpan.textContent = "℉";
                            temperatureDegree.textContent = Fahrenheit;
                        }
                    });


                    console.log(weather[0].description);
                    temperatureDescription.textContent = weather[0].description;
                    locationTimezone.textContent = data.timezone;
                    // https://github.com/yuvraaaj/openweathermap-api-icons or try to skycons
                    // skycons => icon.replace(/-/g, "_" ).toUpperCase();
                    const { icon } = weather[0];
                    console.log(icon);
                    weatherIcon.innerHTML = `<img src="./icons/${icon}.png">`;

                });
        });

    }
    // else {
    //     console.log("you can not fount becouse some of reaesons");
    // }
});