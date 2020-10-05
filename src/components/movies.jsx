import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService'
import MoviesTable from './moviesTable'
import Pagination from './common/pagination'
import { paginate } from  '../utils/paginate'
import ListGroup from './common/listGroup'
import Like from './common/like'
import { getGenres } from '../services/fakeGenreService'
import _ from 'lodash'

class Movies extends Component {
    state = { 
        movies: [],
        pageSize: 4,
        currentPage: 1,
        genres: [],
        sortColumn: { path: 'title', order: 'asc' }
    }

    componentDidMount(){
        const genres = [{ _id: "", name: "All Genres" }, ...getGenres()]
        this.setState({ movies: getMovies(), genres: getGenres(), genres })
    }

    handleDelete = (movie) => {
        const movies = this.state.movies.filter(m => m._id !== movie._id)
        this.setState({ movies })
    }

    handleLike = (movie) => {
        const movies = [...this.state.movies]
        const index = movies.indexOf(movie)
        // movies[index] = {...movies[index]}
        movies[index].liked = !movies[index].liked
        this.setState({ movies })
    }

    handlePageChange = page => {
        this.setState({ currentPage: page })
    }

    handlGenreSelect = genre => {
        this.setState({ selectedGenre: genre, currentPage: 1 })
    }

    handleSort = sortColumn => {
        this.setState({ sortColumn })
    }

    getPagedData = () => {
        const {
            pageSize,
            currentPage,
            selectedGenre,
            movies: allMovies,
            sortColumn
        } = this.state

        const filtered = selectedGenre && selectedGenre._id ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])

        const movies = paginate(sorted, currentPage, pageSize)

        return{totalCount: filtered.length, data: movies}
    }

    
    render() { 
        const { length: count } = this.state.movies
        const {
            pageSize,
            currentPage,
            sortColumn
        } = this.state

        if (count === 0)
        return <p>there are no movies in the database.</p>
        
        const {totalCount, data: movies} = this.getPagedData()

        return ( 
           <div className='row'>
                <div className="col-3">
                   <ListGroup items={this.state.genres}
                   selectedItem={this.state.selectedGenre}
                   onItemSelect={this.handlGenreSelect}/>
                </div>
                <div className="col">
                <Like
                    to="/movies/new"
                    className="btn btn-primary"
                    style={{marginBotton: 20}}
                >
                    New Movie
                </Like>
                <p>Showing {totalCount} movies in the database.</p>
                <MoviesTable 
                 movies={movies}
                 onLike={this.handleLike} 
                 onDelete={this.handleDelete}
                 onSort={this.handleSort}
                 sortColumn={sortColumn}
                 />
                <Pagination 
                    itemsCount={count} 
                    pageSize={pageSize} 
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange} 
                />
                </div>
            </div>
        );
    }
}
 
export default Movies;