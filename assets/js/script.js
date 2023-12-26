//Weather display
$(document).ready(() => {
  const apiKey = "cf19e26cd84560f303a4c185e64c50ca";
  const forecastDiv = $("#forecast");

  const getCurrentWeather = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords);
        const { latitude, longitude } = position.coords;

        // get city name
        fetch(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
        )
          .then((res) => {
            if (!res.ok) throw new Error("couldn't get city name");
            return res.json();
          })
          .then((data) => {
            const { name } = data[0];
            $("#city-name").text(`${name}`);
            return fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
            );
          })
          .then((res) => {
            if (!res.ok) throw new Error("error: couldn't get forecast data");
            return res.json();
          })
          .then(({ list }) => {
            const relevant = list.filter(
              ({ dt_txt }) => dt_txt.slice(11, 13) === "12"
            );
            for (let forecast of relevant) {
              const forecastCard = $("<div></div>");
              forecastCard.addClass("card col-lg-2 col-md-2 col-sm-12");
              const cardBody = $("<div></div>");
              cardBody.addClass("card-body");
              const day = $("<h5></h5>");
              day.addClass("card-title");
              day.text(dayjs(forecast.dt_txt).format("dddd, MMMM Do"));
              const icon = $("<img>");
              icon.attr(
                "src",
                `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`
              );
              icon.addClass("card-img-top");
              icon.attr("alt", forecast.weather[0].description);
              const temp = $("<p></p>");
              temp.text((forecast.main.temp - 273.15).toFixed(2));
              temp.addClass("temperature card-text");

              cardBody.append(day);
              cardBody.append(icon);
              cardBody.append(temp);

              forecastCard.append(cardBody);
              forecastDiv.append(forecastCard);
            }
          });
      },
      (e) => {
        $("#locationModal").modal("show");
        const errMsg = $("<h2></h2>");
        errMsg.text(
          "If you turn on location, you will be able to see a 5-day forecast here."
        );
        errMsg.attr("id", "locationMessage");
        forecastDiv.append(errMsg);
      }
    );
  };

  getCurrentWeather();
});

//Plant search modal: validate and store data upon submit, and reset the form
$("#plantSearchBtn").click(function () {
  var userPlantName = $("#userPlantName");
  var userSciPlantName = $("#userSciPlantName");
  $("#plantsearch").trigger("reset");
});

//Plant search modal: validation

//Inspo modal: store data upon submit and reset form
$("#getinspoBtn").click(function () {
  $(".form-check-input").removeAttr("checked");
});
