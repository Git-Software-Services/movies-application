/**
 * es6 modules and imports
 */
import $ from "jquery";
import sayHello from './hello';
console.log(sayHello("yo!"));


/**
 * require style imports
 */
import {getMovies} from './api.js';

const renderMovies = () => {
    getMovies().then((movies) => {
        $("#movieTitle").val("");
        $("#movieRating").val("");
        $("#loading").css("display", "none");
        $("#addMovieForm").css("display", "block");
        $("#helloThere").html((sayHello("World!")));
        movies.forEach(({title, rating, id}) => {
            $(".container").append(`id#${id} - ${title} - rating: ${rating}<br>`);
        });
    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.')
        console.log(error);
    });
};
renderMovies();



const addMovie =(movieTitle, movieRating) => {
    const movieAdded = {title: movieTitle, rating: movieRating};
    const url = '/api/movies';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieAdded),
    };
    fetch(url, options)
        .then(renderMovies);
};

$("#submit").click((e) => {
    e.preventDefault();
    var movieTitle = $("#movieTitle").val();
    var movieRating = $("#movieRating").val();
    addMovie(movieTitle, movieRating);
    $("#loading").css("display", "block");
    $("#addMovieForm").css("display", "none");
    $("#helloThere").html("");
    $(".container").html("");
});

$("#editExistingMovie").click(function (e) {
        e.preventDefault();
    getMovies().then((movies) => {
        console.log(movies.length);
        $("#editMovieForm").css("display", "block");
        var total = "";
        for (var i=0; i < movies.length; i++){
            total += `<option>${movies[i].title}</option>`
        };
        console.log(total);
         $("#movieSelector").append(total);
        // movies.forEach(({title, rating, id}) => {
        //     $(".container").append(`id#${id} - ${title} - rating: ${rating}<br>`);
        // });
    });
// Function that displays editable data for selected movie on click
    $("#edit").click(function (e){
        e.preventDefault();
        var movieBeingEdited = $("#movieSelector :selected").text();
        console.log(movieBeingEdited);
        $("#updateMovieDiv").html("Movie Title:\n" +
            "    <br>\n" +
            "    <input type=\"text\" id=\"updateMovieTitle\" name=\"updateMovieTitle\">\n" +
            "    <br>\n" +
            "    Rating:\n" +
            "    <br><input type=\"text\" id=\"updateMovieRating\" name=\"updateMovieRating\">\n" +
            "    <br>\n" +
            "    <br>\n" +
            "    <button type=\"submit\" id=\"update\">Update</button>");
        //Prefills the input with selected movie (rating defaults to 0 for now)
        $("#updateMovieTitle").val(movieBeingEdited);
        $("#updateMovieRating").val(0);
        $("#editMovieForm").css("display", "none");
    });
    //Function to update html with edited data
    $("#update").click(function (e){
        e.preventDefault();


    });
});