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

//Function to render movies in HTML
const renderMovies = () => {
    //added the following line to erase current html before appending new html
    $(".container").html("");
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


// Function that adds movies to database and HTML
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

//Click function to add movies to database and HTML
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


// Click function that creates the dropdown selection list of movies from the database
$("#editExistingMovie").click(function (e) {
        e.preventDefault();
    getMovies().then((movies) => {
        // console.log(movies.length);
        $("#editMovieForm").css("display", "block");
        var total = "";
        for (var i=0; i < movies.length; i++){
            total += `<option>${movies[i].title}</option>`
        };
        // console.log(total);
         $("#movieSelector").append(total);
        // movies.forEach(({title, rating, id}) => {
        //     $(".container").append(`id#${id} - ${title} - rating: ${rating}<br>`);
        // });
    });



    // Click function that displays form of editable data for selected movie on click
    var movieBeingEdited = "";
    var movieRating = "";
    var movieId = "";
    $("#edit").click(function (e){
        e.preventDefault();
        getMovies().then((movies) => {
        movieBeingEdited = $("#movieSelector :selected").text();
        $("#updateMovieDiv").html("<br>Movie Title:\n" +
            "    <br>\n" +
            "    <input type=\"text\" id=\"updateMovieTitle\" name=\"updateMovieTitle\">\n" +
            "    <br>\n" +
            "    Rating:\n" +
            "    <br><input type=\"text\" id=\"updateMovieRating\" name=\"updateMovieRating\">\n" +
            "    <br>\n" +
            "    <br>\n" +
            "    <button type=\"submit\" id=\"update\">Update</button>");


        //Prefills the edit input with selected movie
        $("#updateMovieTitle").val(movieBeingEdited);
        $("#editMovieForm").css("display", "none");

            //Prefills the edit input with selected movie rating
            for (var i=0; i < movies.length; i++){
                if (movies[i].title === movieBeingEdited) {
                    movieRating = movies[i].rating;
                    $("#updateMovieRating").val(movieRating);
                }
            };
        });
    });


    //Click function to update edited movies
    $(document).on("click", "#update", function (){
        e.preventDefault();
        getMovies().then((movies) => {
            for (var i=0; i < movies.length; i++){
                if (movieBeingEdited === movies[i].title){
                    console.log("OK");
                    movieBeingEdited = $("#updateMovieTitle").val();
                    movieRating = $("#updateMovieRating").val();
                    movies[i].title = movieBeingEdited;
                    movies[i].rating = movieRating;
                    movieId = movies[i].id;
                    editMovie(movieBeingEdited, movieRating, movieId);
                };
            };
        });
    });
});


// add edited movie data to database and HTML
const editMovie =(movieBeingEdited, movieRating, movieId) => {
    const movieEdited = {title: movieBeingEdited, rating: movieRating};
    const url = `/api/movies/${movieId}`;
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieEdited),
    };
    fetch(url, options)
        .then(renderMovies);
};