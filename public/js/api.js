
$(function () {

    $.ajax("/api", {
        type: "GET"
      }).then(
        //
      );
  // function getLatLong(callback) {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(function (position) {
  //       lat = position.coords.latitude;
  //       long = position.coords.longitude;
  //       callback(lat, long);
  //     });
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //     callback(lat, long);
  //   }
  // }

  // $("#getNYTimes").on("click", function () {
  //   getNYTTimesData("information technology");
  // });
  // function getNYTTimesData(topic) {
  //   $.ajax("/nytimes", {
  //     type: "POST",
  //     data: { topic: topic }
  //   }).then(
  //     function (res) {
  //       //location.reload();
  //       //console.log(res);
  //       var ny = res.nytimes.docs;
  //       //var size = Object.keys(response.tracks.items).length;
  //       var strNY = `<div class="card">
  //             <div class="card-header">`;
  //       for (let i = 0; i < ny.length; i++) {
  //         strNY += `<b>${ny[i].headline.main}</b><br>${ny[i].snippet} <br> <a target="_blank" href="${ny[i].web_url}">${ny[i].web_url}</a><br> <hr>`;
  //       }
  //       strNY += `</div>
  //             </div>`;
  //             $("#nytimesData").append(strNY);
  //     }
  //   );
  // }
  
  // getLatLong(getWeatherData);
  // function getWeatherData(lat, long) {
  //   if (!lat) lat = 32.8531813;
  //   if (!long) long = -117.1826385;
  //   $.ajax("/weather", {
  //     type: "POST",
  //     data: { lat: lat, long: long }
  //   }).then(
  //     function (res) {
  //       $("#weather").append(`
  //       <div class="row">
  //             <div class="col-md-12">
  //               <div class="card">
  //                   <div class='card-header'>
  //                 <h3><span><img
  //                       src="/images/weather/${res.weather.icon}.png"></span>${res.weather.summary}
  //                 </h3>
  //                 </div>
  //                 <div class='card-body'>
  //                   <div class="row">
  //                     <div class='col-sm-4'>Description</div>
  //                     <div class='col-sm-8'>${res.weather.summaryHourly}</div>
  //                   </div>
  //                   <div class='row'>
  //                     <div class='col-sm-4'>Temperature</div>
  //                     <div class='col-sm-8'>${res.weather.tempMax}F</div>
  //                   </div>
  //                   <div class='row'>
  //                     <div class='col-sm-4'>Humidity</div>
  //                     <div class='col-sm-8'>${res.weather.humidity}%</div>
  //                   </div>
  //                   <div class='row'>
  //                     <div class='col-sm-4'>Wind Speed</div>
  //                     <div class='col-sm-8'>${res.weather.windSpeed} mph</div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //       `);
  //     }
  //   );
  // }
  // getGiphyData();
//   function getGiphyData() {
//     $.ajax("/giphy", {
//       type: "GET"
//     }).then(
//       function (res) {
//         $("#giphy").attr(`src`, res.giphy);
//       }
//     );
//   }
 });