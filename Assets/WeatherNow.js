$(document).ready(function() {
    $("#BtnSearch").on("click", function(){
        var city = $("#inputSearch").val()
        $("#inputSearch").val("")
        searchWeather(city)
    });
    function searchWeather(city){
     var apiKey ="31015d8b2a1c9f911cfd3740406fe3c8"
        $.ajax({
            type:"GET",
    url:"http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial",
    dataType:"JSON",
    success:function(results){
        console.log(results)
    // If you want to create a history link, it would go here!
    $("#currentweather").empty()
    var card = $("<div>").addClass("card")
    var cardbody = $("<div>").addClass("card-body")
    var wind = $("<p>").addClass("card-text").text("Current Wind: "  + results.wind.speed)
    var temp = $("<p>").addClass("card-text").text("Current Temperature: " + results.main.temp)
    var humid = $("<p>").addClass("card-text").text("Current Humidity: " + results.main.humidity)

    // var titledate = city titles would go here
    cardbody.append(wind,humid,temp)
    card.append(cardbody)
    $("#currentweather").append(card)
    getForecast(city)
    // get UV index would go here
}

    })

}
 function getForecast(city) {
    var apiKey ="31015d8b2a1c9f911cfd3740406fe3c8"
    $.ajax({
        type:"GET",
   url:"http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial",
   dataType:"JSON",
   success:function(results){
    console.log(results)
    $("#5-day").html("<h4 class=\"mt-3\">5-day Forecast:</h4>").append("<div class=\"row\">");
    for(var i=0; i < results.list.length;i++){
     if(results.list[i].dt_txt.indexOf("15:00:00")!== -1 ){
        var col = $("<div>").addClass("col-md-2")
        var card = $("<div>").addClass("card bg-primary text-white")
        var body = $("<div>").addClass("card-body p-2")
        var temp = $("<p>").addClass("card-text").text("temp" + results.list[i].main.temp)
        var humid = $("<p>").addClass("card-text").text("humid" + results.list[i].main.humidity)
        
        
        // title would go here
        col.append(card.append(body.append(temp, humid)))
        $("#5-day").append(col)

     }
     
    }

    }})}

   var history = json.parse(window.localStorage.getItem("history")) || [];

   if (history.length > 0) {
     searchWeather(history[history.length-1]);
 }

 for (var i = 0; 1 < history.length; i++) {
     makeRow(history[i]);
 }
    















});
