

/**
 * es6 modules and imports
 */
// import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";
import sayHello from './hello';
/**
 * require style imports
 */
import {getMovies} from './api.js';

//Add username to jumbotron////////////////////////////////////////////////////////////////////////////////////////////
$('#addUser').click(function(e){
    e.preventDefault();
    var newUserName = $("#userNameInput").val();
    $("#helloThere").html((sayHello(newUserName)));
});


//Function to render movies in HTML//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const renderMovies = () => {
    // debugger;
    $(".movieContainer").html("");
    // $(".movieInfoContainer").html("");
    getMovies().then((movies) => {
        $("#movieTitle").val("");
        $("#movieRating").val("");
        $("#loading").css("display", "none");
        $("#addMovieForm").css("display", "block");
        $("#helloThere").html((sayHello("Random User")));
        movies.forEach(({title, rating, id}) => {
            $(".movieContainer").append(`<li class="list-group-item">
<button type="button" value="X" class="deleteButton xs-btn btn-outline-danger" id="${id}">Delete</button>
${title} <span class="float-right"> <strong>Rating:</strong> ${rating}</span>
</li>`)
    // addMovieInfo(title);
        });
    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.')
        console.log(error);
    });
};



// Function that adds movies to database and HTML//////////////////////////////////////////////////////////////////////
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
        .then(arrangeAllMovieInfo)
        // $('.movieInfoContainer').html((addMovieInfo(movieTitle)));
    // });
};


//Click function to add movies to database and HTML/////////////////////////////////////////////////////////////////////
$("#submit").click((e) => {
    e.preventDefault();
    var movieTitle = $("#movieTitle").val();
    var movieRating = $("#movieRating").val();
    addMovie(movieTitle, movieRating);
    // arrangeAllMovieInfo();
    $("#loading").css("display", "block");
    $("#addMovieForm").css("display", "none");
    $("#helloThere").html("");
    // $(".movieContainer").html("");
});


// Click function that creates the dropdown selection list of movies from the database//////////////////////////////////
$("#editExistingMovie").click(function (e) {
    e.preventDefault();
    getMovies().then((movies) => {
        $("#editMovieForm").css("display", "block");
        var total = "";
        for (var i=0; i < movies.length; i++){
            total += `<option>${movies[i].title}</option>`
        };
        $("#movieSelector").append(total);
    });


    // Click function that displays form of editable data for selected movie on click///////////////////////////////////
    var movieBeingEdited = "";
    var movieRating = "";
    var movieId = "";
    $("#edit").click(function (e){
        e.preventDefault();
        getMovies().then((movies) => {
            movieBeingEdited = $("#movieSelector :selected").text();
        // $('.movieInfoContainer').html((addMovieInfo(movieBeingEdited)));
            $("#updateMovieDiv").html("<span class=\"white\">Title:</span>" +
                "    <input type=\"text\" id=\"updateMovieTitle\" name=\"updateMovieTitle\">" +
                "    <span class=\"white\">Rating:</span>" +
                "    <input type=\"text\" id=\"updateMovieRating\" name=\"updateMovieRating\">" +
                "    <button type=\"submit\" id=\"update\" class=\"btn-sm\">Update</button>");

            //Prefills the edit input with selected movie///////////////////////////////////////////////////////////////
            $("#updateMovieTitle").val(movieBeingEdited);
            $("#editMovieForm").css("display", "none");

            //Prefills the edit input with selected movie rating////////////////////////////////////////////////////////
            for (var i=0; i < movies.length; i++){
                if (movies[i].title === movieBeingEdited) {
                    movieRating = movies[i].rating;
                    $("#updateMovieRating").val(movieRating);
                }
            };
        });
    });


    //Click function to update edited movies///////////////////////////////////////////////////////////////////////////
    $(document).on("click", "#update", function (){
        e.preventDefault();
        $('#updateMovieDiv').css('display', 'none');
        getMovies().then((movies) => {
            for (var i=0; i < movies.length; i++){
                if (movieBeingEdited === movies[i].title){
                    movieBeingEdited = $("#updateMovieTitle").val();
                    movieRating = $("#updateMovieRating").val();
                    movies[i].title = movieBeingEdited;
                    movies[i].rating = movieRating;
                    movieId = movies[i].id;
                    editMovie(movieBeingEdited, movieRating, movieId);
                    // addMovieInfo(movieBeingEdited);
                };
            };
        });
    });
});


// add edited movie data to database and HTML////////////////////////////////////////////////////////////////////////////////////////////////
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


//Click function to delete movies////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on("click", ".deleteButton", function (e){
    e.preventDefault();
    getMovies().then((movies) => {
        for (var i=0; i < movies.length; i++){
                var deleteMovieId = movies[i].id;
            if ($(this).attr('id') === movies[i].id.toString()){
                deleteMovie(deleteMovieId);
            };
        };
    });
});


// Delete movie function////////////////////////////////////////////////////////////////////////////////////////////////
const deleteMovie =(deleteMovieId) => {
    let url = `/api/movies/${deleteMovieId}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    fetch(url, options)
        .then(arrangeAllMovieInfo);
};


var html= "";


// Function that adds movie images and info to HTML/////////////////////////////////////////////////////////////////////
const addMovieInfo = (movie) => {
    // $(".movieInfoContainer").html("");
    console.log(movie);
    const API_TOKEN = '909446a614e303473b8ce209449992d9';
    var imgUrl = '';
    var replacedMovie = movie.split(' ').join('+');
    var url = `https://api.themoviedb.org/3/search/movie?api_key=${API_TOKEN}&query=${replacedMovie}`;

    const getMovieUrl = fetch(url)
        .then((response) => response.json())
        .then(function(data){
            // console.log(data);
            var movieImg = "";
            var movieOverview = "";
            var movieName = "";
            var releaseDate = "";
            var newData = "";
            movieImg = data.results[0].poster_path;
            movieOverview = data.results[0].overview;
            movieName = data.results[0].original_title;
            releaseDate = data.results[0].release_date;
            imgUrl = `https://image.tmdb.org/t/p/w500${movieImg}`;
            console.log(movieName);
            console.log(movie);

                newData = "<div class='card view view-tenth' >" +
                    "<img id='newMovieSrc' src=''" +
                    "class='card-img-bottom alt='...'>" +
                    "<div class='card-body mask'>" +
                    "<h5 class='card-title'>" +
                    movieName +
                    "</h5>" +
                    "<p class='card-text overflow-control' id='movieOverview'><span>" +
                    movieOverview +
                    "</span><a href=''></a></p>" +
                    "<p class='card-text overflow-control' ><small class='text-muted'>" +
                    // rating +
                    "</small></p>" +
                    "</div>" +
                    "<div class=\"card-footer\">\n" +
                    "      <small class=\"text-muted\">" +
                    "Released:" +
                    releaseDate +
                    "</small>\n" +
                    "    </div></div>";

                html = '' + newData + '';
        });

        const getMovieImageUrl = fetch(imgUrl)

            Promise.all([getMovieUrl, getMovieImageUrl]).then(function () {
                $("#newMovieSrc").attr("src", imgUrl);
                // $(".movieInfoContainer").prepend(html);
                $(html).prependTo(".movieInfoContainer");
            });
};


//Function to display movie information in both Divs containing movie details
function arrangeAllMovieInfo() {
    renderMovies();
    $(".movieInfoContainer").html("");
    getMovies().then((movies) => {
        for (var i = 0; i < movies.length; i++) {
            var movie = movies[i].title;
            console.log(movie);
            $(".movieInfoContainer").html("");
            addMovieInfo(movie);
        };

    });
}

//Function call when page loads to show movie details on page
arrangeAllMovieInfo()