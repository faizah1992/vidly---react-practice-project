import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService'
import Like from "./common/like"
import Pagination from './common/pagination'
import { paginate } from  '../utils/paginate'
import ListGroup from './common/listGroup'
import { getGenres } from '../services/fakeGenreService'

class Movies extends Component {
    state = { 
        movies: [],
        pageSize: 3,
        currentPage: 1,
        genres: []
    }

    componentDidMount(){
        const genres = [{ name: "All Genres" }, ...getGenres()]
        this.setState({ movies: getMovies(), genres: getGenres(), genres })
    }

    handleDelete = (movie) => {
        const movies = this.state.movies.filter(m => m._id !== movie._id)
        this.setState({ movies })
    }

    handleLike = (movie) => {
        const movies = [...this.state.movies]
        const index = movies.indexOf(movie)
        movies[index] = {...movies[index]}
        movies[index].liked = !movies[index].liked
        this.setState({ movies })
    }

    handlePageChange = page => {
        this.setState({ currentPage: page })
    }

    handlGenreSelect = genre => {
        this.setState({ selectedGenre: genre, currentPage: 1 })
    }

    
    render() { 
        // const { length: count } = this.state.movies
        if (this.state.movies.length === 0)
        return <p>there are no movies in the database.</p>
        
        const filtered = this.state.selectedGenre && this.state.selectedGenre._id ? this.state.movies.filter(m => m.genre._id === this.state.selectedGenre._id) : this.state.movies
        const movies = paginate(filtered, this.state.currentPage, this.state.pageSize)

        return ( 
           <div className='row'>
                <div className="col-3">
                   <ListGroup items={this.state.genres}
                   selectedItem={this.state.selectedGenre}
                   onItemSelect={this.handlGenreSelect}/>
                </div>
                <div className="col">
                <p>Showing {filtered.length} movies in the database.</p>
                <table className="table">
                <thead>
                   <tr>
                       <th>Title</th>
                       <th>Genre</th>
                       <th>Stock</th>
                       <th>Rate</th>
                       <th/>
                       <th/>
                   </tr>
               </thead>
               <tbody>
                   {this.state.movies.map(movie => (
                        <tr key={movie._id}>
                            <td>{movie.title}</td>
                            <td>{movie.genre.name}</td>
                            <td>{movie.numberInStock}</td>
                            <td>{movie.dailyRentalRate}</td>
                            <td>
                                <Like liked={movie.liked} onClick={() => this.handleLike(movie)}/>
                            </td>
                            <td><button onClick= {() => this.handleDelete(movie)} className="btn btn-danger btn-sm">Delete</button></td>
                        </tr>
                   ))}
                </tbody>
                </table>
                <Pagination 
                    itemsCount={filtered.length} 
                    pageSize={this.state.pageSize} 
                    currentPage={this.state.currentPage}
                    onPageChange={this.handlePageChange} 
                />
                </div>
            </div>
        );
    }
}
 
export default Movies;