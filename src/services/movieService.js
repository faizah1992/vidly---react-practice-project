import httpService from "./httpService";

const { func } = require("prop-types");

import http from './httpService'

const apiEndPoint = 'http://localhost:3900/api/movies'
export function getMovies() {
    return http.get(apiEndPoint)
}

export function deleteMovie(movieId) {
    return http.delete(apiEndPoint + '/' + movieId)
}