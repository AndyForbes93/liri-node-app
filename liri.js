//pulling keys from env
require("dotenv").config();
//keys
var keys = require('./keys.js');
//declaring apis
var Spotify = require('node-spotify-api');
var omdb = require('omdb');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");
//adding keys 
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
//twitter parameters
var params = {
    screen_name: 'drumboner',
    count: 20,
    trim_user: true
};
//taking command
var command = process.argv[2];
//input array that adds any space to it then combines them to make proper inut whether or not it is supposed to
var input = [];


var dataArr = [];
//for loop push following values into array
for (i = 3; i < process.argv.length; i++) {
    input.push(process.argv[i]);
}
switch (command) {
    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            // console.log(data);

            doItArr = data.split(",");


             command = doItArr[0];
             input.push(doItArr[1]);
           //  console.log(input);

           /*I still couldnt get the code to take the input from reading random.txt it will run the first command,
            but it wont take the input at array[1] for searching the song I will come back to this to fix it once i know why its not taking it*/

        });
        //spotify input
    case "spotify-this-song":
   // console.log(input);
        if (input == "") {
            input.push("Ace", "of", "base");
        }
        //joins array to match spotify search parameters
        var commandData = input.join(" ");
        spotify
            //search criteria
            .search({
                type: 'track',
                query: commandData,
                limit: 2
            })
            //telling function to console log info
            .then(function (response) {
                console.log("Artist: " + JSON.stringify(response.tracks.items[0].artists[0].name, null, 2));
                console.log("From the Album: " + JSON.stringify(response.tracks.items[0].album.name, null, 4));
                console.log("Track Name: " + JSON.stringify(response.tracks.items[0].name, null, 4));
                console.log("Check the song out here:  " + JSON.stringify(response.tracks.items[0].external_urls.spotify, null, 4));
            })
            //request errors
            .catch(function (err) {
                console.log(err);
            });
        break;
    case "movie-this":
        if (input == "") {
            input.push("Mr", "Nobody")
        }
        var movieName = input.join("+");
        // Then run a request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        // Then create a request to the queryUrl
        request(queryUrl, function (error, response, body) {
            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {
                console.log(JSON.parse(body).Title);
                console.log("Released on: " + JSON.parse(body).Released);
                console.log("IMDB Score: " + JSON.parse(body).Ratings[0].Value);
                console.log("Rotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value);
                console.log("Released in: " + JSON.parse(body).Country);
                console.log("Language(s): " + JSON.parse(body).Language);
                console.log(JSON.parse(body).Plot);
                console.log("Staring: " + JSON.parse(body).Actors);
            }
        });
        break;
    case "my-tweets":
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (var i = 0; i < 19; i++) {
                    console.log("===================")
                    console.log(tweets[i].created_at);
                    console.log(tweets[i].text);
                }
            }
        });
        break;

}