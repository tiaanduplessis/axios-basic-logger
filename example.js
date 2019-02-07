import axios from "axios";
import useLogger from "axios-basic-logger";

useLogger(axios);

axios
  .get("https://jsonplaceholder.typicode.com/todos")
  .then(() => console.log("ja"));

// REQUEST  10:35:16:244 GET https://jsonplaceholder.typicode.com/todos 
// RESPONSE 10:35:16:283 200 (GET https://jsonplaceholder.typicode.com/todos) 39ms 
// ja