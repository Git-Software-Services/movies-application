/**
 * es6 modules and imports
 */

import sayHello from './hello';
/**
 * require style imports
 */
import {getMovies} from './api.js';

//Add username to jumbotron=============================================================================================
$('#addUser').click(function(e){
    e.preventDefault();
    var newUserName = $("#userNameInput").val();
    $("#helloThere").html((sayHello(newUserName)));
});


//Function to render movies under Random Movie Collection sidebar=======================================================
const renderMovies = () => {
    $(".movieContainer").html("");
    // $(".movieInfoContainer").html("");
    getMovies().then((movies) => {
        $("#movieTitle").val("");
        $("#movieRating").val("");
        $("#loading").css("display", "none");
        $("#addMovieForm").css("display", "block");
        $("#helloThere").html((sayHello("Random User")));

        movies.forEach(({title, rating, id}) => {
console.log(title)
            var ratingNumber = parseInt(rating);
            if (ratingNumber > 0) {
                var star = "";
                for(var i = 1; i <= ratingNumber; i++) {
                    star += `<i class="fas fa-star"></i>`;
                }
            }
            $(".movieContainer").append(`<li class="list-group-item ">
<button type="button" value="X" class="deleteButton xs-btn btn-outline-danger float-left" id="${id}">Delete</button>
<span class="movieTitleFont">${title}</span> <span class="float-right"> <strong>Rating:</strong><br></span><br><span class="float-right"> ${star}</span>
</li>`)
            $('.fa-star').css('color', 'rgba(225,190,64,.7)')
        });

    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.')
        console.log(error);
    });
};


// Function that adds movies to database and HTML=======================================================================
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
        .then(addMovieInfo)
};


//Click function to add movies to database and HTML=====================================================================
$("#submit").click((e) => {
    e.preventDefault();
    var movieTitle = $("#movieTitle").val();
    var movieRating = $("#movieRating").val();

    addMovie(movieTitle, movieRating);
    $("#loading").css("display", "block");
    $("#addMovieForm").css("display", "none");
    $("#helloThere").html("");
});


// Click function that creates the dropdown selection list of movies from the database==================================
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


    // Click function that displays form of editable data for selected movie on click==================================
    var movieBeingEdited = "";
    var movieRating = "";
    var movieId = "";
    $("#edit").click(function (e){
        e.preventDefault();
        getMovies().then((movies) => {
            movieBeingEdited = $("#movieSelector :selected").text();
            $("#updateMovieDiv").html("<span class=\"white\">Title:</span>" +
                "<input type=\"text\" id=\"updateMovieTitle\" name=\"updateMovieTitle\">" +
                "<span class=\"white\">Rating:</span>" +
                "<select id=\"updateMovieRating\" name=\"updateMovieRating\" class=\"mx-2\">" +
                "<option value=\"1 star\">1 Star</option>" +
                "<option value=\"2 stars\">2 Stars</option>" +
                "<option value=\"3 stars\">3 Stars</option>" +
                "<option value=\"4 stars\">4 Stars</option>" +
                "<option value=\"4 stars\" selected=\"selected\">5 Stars</option>" +
                "</select>" + "<button type=\"submit\" id=\"update\" class=\"btn-sm\">Update</button>");

            //Prefills the edit input with selected movie///////////////////////////////////////////////////////////////
            $("#updateMovieTitle").val(movieBeingEdited);
            $("#editMovieForm").css("display", "none");

            //Prefills the edit input with selected movie rating////////////////////////////////////////////////////////
            for (var i=0; i < movies.length; i++){
                if (movies[i].title === movieBeingEdited) {
                    movieRating = movies[i].rating;
                    $("#updateMovieRating").val(movieRating);
                };
            };
        });
    });


    //Click function to update edited movies============================================================================
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
                };
            };
        });
    });
});


// add edited movie data to database and HTML===========================================================================
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


//Click function to delete movies=======================================================================================
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


// Delete movie function================================================================================================
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


// Function that adds movie images and info to HTML=====================================================================
            var html= "";
            var movieImg = "";
            var movieId = "";
            var movieOverview = "";
            var movieName = "";
            var releaseDate = "";
            var newData = "";
            var youTubeTrailer ="";
            var movieImgRequest ="";
            var imgUrl = '';
            var movieTrailerUrl ="";

const addMovieInfo = (movie, movieArrayId, movieTrailerUrl) => {

    const API_TOKEN = '909446a614e303473b8ce209449992d9';
    var replacedMovie = movie.split(' ').join('+');
    var url = `https://api.themoviedb.org/3/search/movie?api_key=${API_TOKEN}&query=${replacedMovie}`;

    const getMovieUrl = fetch(url)
        .then((response) => response.json())
        .then(function(data){
            movieImg = data.results[0].poster_path;
            movieId = data.results[0].id;
            movieId = movieId.toString();
            movieOverview = data.results[0].overview;
            movieName = data.results[0].original_title;
            releaseDate = data.results[0].release_date;
            imgUrl = `https://image.tmdb.org/t/p/w500${movieImg}`;
            movieImgRequest = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_TOKEN}&append_to_response=videos,images`

        })
        .then(() => {
            const getMovieImgRequest = fetch(movieImgRequest)

        .then((response) => response.json())
            Promise.all([getMovieUrl, getMovieImgRequest])
        .then(function (data) {
            console.log(data);
            youTubeTrailer = data[1].videos.results[0].key;
            var youtubeUrl= `https://youtube.com/embed/`;
            movieTrailerUrl = youtubeUrl + youTubeTrailer;
            postMovieInfo(movieArrayId, movieTrailerUrl);
        });
            $('#moveInfoContainer').html('');

                newData = `<div class='card view view-tenth' ><img class='card-img-bottom' id= 'newMovieSrc' src=''><div class='card-body mask'><h6 class='card-title'>${releaseDate}</h6> <button id="trailerUrl" href='' type="button" class="link btn-sm btn-outline-light" data-toggle="modal" data-target=".bd-example-modal-lg">View Trailer</button><p class='card-text overflow-control' id='movieOverview'><span>${movieOverview}</span><br><br><small class='text-muted'></small></p></div>`;

console.log(movieId);
                html = newData;
                $(html).prependTo(".movieInfoContainer");
                $('#newMovieSrc').attr('src', imgUrl);
                console.log(imgUrl);
                $('#trailerUrl').attr('href', movieTrailerUrl);
                console.log(movieTrailerUrl);
    });
};


// Function to add movie trailer to database then display movie cards in div
const postMovieInfo = (movieArrayId, movieTrailerUrl) => {
    movieArrayId = parseInt(movieArrayId);
    console.log(movieTrailerUrl);
        const addUrls = {movieTrailer: movieTrailerUrl};
        const url = `/api/movies/${movieArrayId}`;
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addUrls),
        };
        fetch(url, options)
            .then(() => {
                newData = `<div class='card view view-tenth' ><img class='card-img-bottom' id= 'newMovieSrc' src=''><div class='card-body mask'><h6 class='card-title'>${releaseDate}</h6> <button id="trailerUrl" href='' type="button" class="link btn-sm btn-outline-light" data-toggle="modal" data-target=".bd-example-modal-lg">View Trailer</button><p class='card-text overflow-control' id='movieOverview'><span>${movieOverview}</span><br><br><small class='text-muted'></small></p></div>`;

                $('#trailerUrl').attr('href', movieTrailerUrl);
            });
};


//Click function to display modal with embedded youtube trailer=========================================================
$(document).on("click",".link", function (e) {
    e.preventDefault();
    console.log('link clicked');
    console.log(movieTrailerUrl);
    var src = $(this).attr('href');
        $('#myModal').modal('show');
    $('#myModal iframe').attr('src', src);
    $('#myModal iframe').css('width', '100%');

});
$("#myModal").on('hide.bs.modal', function(){
    $("#myModal iframe").attr('src', '');
});



//Function to display movie information in both Divs containing movie details===========================================
function arrangeAllMovieInfo() {
    renderMovies();
    $(".movieInfoContainer").html("");
    getMovies().then((movies) => {
        for (var i = 0; i < movies.length; i++) {
            var movie = movies[i].title;
            var movieArrayId = movies[i].id;
             movieTrailerUrl = movies[i].movieTrailer;
            $(".movieInfoContainer").html("");
            console.log(movieArrayId);
            addMovieInfo(movie, movieArrayId, movieTrailerUrl);
        };
    });
};

//Function call when page loads to show movie details on page===========================================================
arrangeAllMovieInfo()










