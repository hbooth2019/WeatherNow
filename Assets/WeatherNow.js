$(document).ready(function () {
  var apiKey = "31015d8b2a1c9f911cfd3740406fe3c8"

  $("form").on("submit", function (e) {
    e.preventDefault()
    var city = $("#inputSearch").val()
    $("#inputSearch").val("")
    searchWeather(city)
  });

  function formatDate(timestamp) {
    return moment(timestamp * 1000).format("L")
  }
  var historyArray = JSON.parse(window.localStorage.getItem("history")) || []

  function getHistory() {
    if (historyArray.length > 0) {
      searchWeather(historyArray[0])
    }
  }

  getHistory()

  function setHistory(city) {
    if (historyArray[0] !== city) {
      historyArray.unshift(city)
      localStorage.setItem('history', JSON.stringify(historyArray));
      historyArray = JSON.parse(window.localStorage.getItem("history"))
    }
    console.log(historyArray)
    makeRows()
  }

  function makeRows() {
    $("#list").empty()
    for (var i = 0; i < historyArray.length; i++) {
      var historyItem = $("<li>").addClass("row history-btn").text(historyArray[i])
      $("#list").append(historyItem)
    }
    bindButtons()
  }

  function bindButtons() {
    $(".history-btn").on('click', function (e) {
      e.preventDefault()
      console.log(e.target.innerHTML);
      searchWeather(e.target.innerHTML)
    })
  }

  function searchWeather(city) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial",
      dataType: "JSON",
      success: function (results) {
        console.log({
          results
        })
        $("#currentweather").empty()
        var card = $("<div>").addClass("card")
        var cardBody = $("<div>").addClass("card-body current")
        var date = formatDate(results.dt)
        var iconUrl = "http://api.openweathermap.org/img/w/" + results.weather[0].icon + ".png"
        var icon = $("<img>").addClass("icon").attr("src", iconUrl)

        var title = $("<h2>").addClass('current-city').text(results.name + " (" + date + ") ")
        title.append(icon)

        var temp = $("<p>").addClass("card-text").text("Temperature: " + results.main.temp + "˚F")

        var humid = $("<p>").addClass("card-text").text("Humidity: " + results.main.humidity + "%")

        var wind = $("<p>").addClass("card-text").text("Wind: " + results.wind.speed + ' mph')
        cardBody.append(title, temp, humid, wind)
        card.append(cardBody)

        $("#currentweather").append(card)

        var lat = results.coord.lat
        var lon = results.coord.lon

        getUVIndex(lat, lon)
        getForecast(city)
        setHistory(results.name)
      }
    })
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon,
      dataType: "JSON",
      success: function (results) {
        console.log('lat,long', results.value)
        var UVIndicator = $("<div>").addClass("indicator").text(results.value)
        var background
        if (results.value <= 4) {
          background = 'green'
        } else if (results.value > 4 && results.value <= 8) {
          background = "yellow"
        } else {
          background = "red"
        }
        UVIndicator.css("background", background)
        var UVIndex = $("<span>").addClass("card-text d-flex flex-row").text("UV Index: ")
        UVIndex.append(UVIndicator)
        var cardBody = $(".current")
        cardBody.append(UVIndex)
      },
    })
  }

  function getForecast(city) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial",
      dataType: "JSON",
      success: function (results) {
        console.log(results)
        $("#5-day").empty()
        for (var i = 0; i < results.list.length; i++) {
          if (results.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            var col = $("<div>").addClass("col-md-2")
            var card = $("<div>").addClass("card bg-primary text-white")
            var body = $("<div>").addClass("card-body p-2")

            var date = formatDate(results.list[i].dt)

            var iconUrl = "http://api.openweathermap.org/img/w/" + results.list[i].weather[0].icon + ".png"

            var icon = $("<img>").addClass("icon").attr("src", iconUrl)

            var temp = $("<p>").addClass("card-text").text("Temp: " + results.list[i].main.temp + "˚F")

            var humid = $("<p>").addClass("card-text").text("Humidity: " + results.list[i].main.humidity + "%")

            col.append(card.append(body.append(date, icon, temp, humid)))
            $("#5-day").append(col)
          }
        }
      }
    })
  }
});
