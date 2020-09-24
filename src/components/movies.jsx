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
        this.setState({ movies: getMovies(), genres: getGenres() })
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

    }

    
    render() { 
        // const { length: count } = this.state.movies
        if (this.state.movies.length === 0)
        return <p>there are no movies in the database.</p>
        const movies = paginate(this.state.movies, this.state.currentPage, this.state.pageSize)

        return ( 
           <div className='row'>
                <div className="col-3">
                   <ListGroup items={this.state.genres} 
                   onItemSelect={this.handlGenreSelect}
                   textProperty='name'
                   valueProperty="_id"/>
                </div>
                <div className="col">
                <p>Showing {this.state.movies.length} movies in the database.</p>
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
                    itemsCount={this.state.movies.length} 
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