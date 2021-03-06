import React, { Component } from 'react';
import { getMovies, deleteMovie } from '../services/movieService'
import MoviesTable from './moviesTable'
import Pagination from './common/pagination'
import { paginate } from  '../utils/paginate'
import ListGroup from './common/listGroup'
import Like from './common/like'
import { getGenres } from '../services/genreService'
import _ from 'lodash'
import SearchBox from './searchBox'
import {toast} from 'react-toastify'

class Movies extends Component {
    state = { 
        movies: [],
        pageSize: 4,
        currentPage: 1,
        genres: [],
        selectedGenre: null,
        searchQuery: "",
        sortColumn: { path: 'title', order: 'asc' }
    }

    async componentDidMount(){
        const {data} = await getGenres()
        const genres = [{ _id: "", name: "All Genres" }, ...data]

        const {data: movies} = await getMovies()
        this.setState({ movies, genres })
    }

    handleDelete = async movie => {
        const originalMovies = this.state.movies
        const movies = originalMovies.filter(m => m._id !== movie._id)
        this.setState({ movies })

        try{
        await deleteMovie(movie._id)
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404)
            toast.error("This movie has already been deleted.")

            this.setState({ movies: originalMovies})
        }
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
        this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 })
    }

    handleSearch = query => {
        this.setState({searchQuery: query, selectedGenre: null,  currentPage: 1 })
    }

    handleSort = sortColumn => {
        this.setState({ sortColumn })
    }

    getPagedData = () => {
        const {
            pageSize,
            currentPage,
            selectedGenre,
            searchQuery,
            movies: allMovies,
            sortColumn
        } = this.state

        const filtered = allMovies
        if(searchQuery)
        filtered = allMovies.filter(m =>
            m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
        )
            else if (selectedGenre && selectedGenre._id)
            filtered = allMovies.filter(m => m.genre._id === selectedGenre._id)

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
                <SearchBox value={searchQuery} onChange={this.handleSearch}/>
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