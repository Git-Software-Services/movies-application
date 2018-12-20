/**
 * es6 modules and imports
 */
import $ from "jquery";
import sayHello from './hello';
console.log(sayHello("yo!"));
document.getElementById("helloThere").innerHTML = (sayHello("World!"));

/**
 * require style imports
 */
import {getMovies} from './api.js';


getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
      $("#movie" + id).text(`id#${id} - ${title} - rating: ${rating}`);
  });
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.')
  console.log(error);
});
