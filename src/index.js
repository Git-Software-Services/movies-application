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
        $("#loading").css("display", "none");
        $("#form").css("display", "block");
        document.getElementById("helloThere").innerHTML = (sayHello("World!"));
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
        .then(renderMovies())
        .catch(alert("Error"));
};

$("#submit").click(function (e) {
    e.preventDefault();
    console.log($("#movieTitle").val() + " " + $("#movieRating").val())
    var movieTitle = $("#movieTitle").val();
    var movieRating = parseFloat($("#movieRating").val());
    addMovie(movieTitle, movieRating);
});