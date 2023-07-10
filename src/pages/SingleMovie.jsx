import { React, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loading from "react-loading";
import Button from "../components/Button";
import { initializeIptvApi } from "../../App";

function SingleMovie() {

    const [loading, setLoading] = useState(true);
    const [iptvApi, setIptvApi] = useState(null);
    const [movie, setMovie] = useState({});
    const { movie_id, title } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchIptvApi() {
            const api = await initializeIptvApi();
            setIptvApi(api);
        }

        fetchIptvApi();
    }, []);

    useEffect(() => {
        // simulate loading data
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [movie]);

    useEffect(() => {
        if (iptvApi && movie_id && title) {
            iptvApi.getVODInfo(movie_id).then((data) => {
                //translate genre, plot, title to spanish and set it to state
                fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${data.info.plot}`).then((response) => response.json()).then((aux) => data.info.plot = aux[0][0][0]);
                fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${data.info.genre}`).then((response) => response.json()).then((aux) => data.info.genre = aux[0][0][0]);
                fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${title}`).then((response) => response.json()).then((aux) => data.info.title = aux[0][0][0]);
                setMovie(data);
            });
        }
    }, [iptvApi, movie_id]);

    return (
        <>

            { Object.keys(movie).length === 0 || movie.info.title === undefined ? (
                <Loading type={"bars"} color={"var(--primary-color)"} height={100} width={100} />
            ) : (
                <div className="popular-movie-slider">

                    {movie && movie.info.movie_image && <img src={movie.info.movie_image} className="movieImg"></img>}

                    <div className="popular-movie-slider-content">
                        <h2 className="movie-name">{movie.info.title}</h2>
                        <ul className="category">
                            {movie.info.genre.split(',').map((genre, index) => {
                                return <li key={index}>{genre}</li>
                            })
                            }
                        </ul>
                        <p className="desc">
                            {movie.info.plot}
                        </p>

                        <div className="movie-info">
                            <div className="element-info">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                    className="flex-icon"
                                >
                                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                    <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                                </svg><span>{
                                    // show duration in hours and minutes. 01:13:20 -> 1h 13m
                                    movie.info.duration.split(':').map((time, index) => {
                                        if (index === 0) {
                                            //remove leading zero
                                            time = time.replace(/^0+/, '')
                                            return time + 'h y '
                                        } else if (index === 1) {
                                            return time + 'm'
                                        }
                                    })
                                }</span>
                            </div>
                            {/* <div className="element-info">
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            height="1em"
                            width="1em"
                        >
                            <path d="M20 4a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h16m0 14V6H4v12h16M6 10h2v2H6v-2m0 4h8v2H6v-2m10 0h2v2h-2v-2m-6-4h8v2h-8v-2z" />
                        </svg>
                        <span>Subtitulos</span>
                    </div> */}
                            <div className="element-info">
                                <svg
                                    viewBox="0 0 1024 1024"
                                    fill="currentColor"
                                    height="1em"
                                    width="1em"
                                >
                                    <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z" />
                                </svg><span><b>{Math.round(movie.info.rating * 10) / 10}/10</b></span>
                            </div>

                            <div className="element-info">
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    height="1em"
                                    width="1em"
                                >
                                    <path d="M3.5 0a.5.5 0 01.5.5V1h8V.5a.5.5 0 011 0V1h1a2 2 0 012 2v11a2 2 0 01-2 2H2a2 2 0 01-2-2V3a2 2 0 012-2h1V.5a.5.5 0 01.5-.5zM1 4v10a1 1 0 001 1h12a1 1 0 001-1V4H1z" />
                                </svg>
                                <span><b>{
                                
                                // show date in format dd/mm/yyyy not yyyy/mm/dd
                               movie.info.releasedate.split('-').reverse().join('/')
                                    
                                }</b></span>

                            </div>

                        </div>

                        <div className="movie-btns">
                            <button className="main__button"><i className="fa fa-play"></i>Ver película</button>
                            <Link to="trailer"><button className="secondary__button"><i className="fa fa-circle"></i> <i className="fa fa-circle"></i> <i className="fa fa-circle"></i>Ver tráiler (En pruebas)</button></Link>
                            <button  onClick={() => navigate(-1)} className="secondary__button"><i className="fa fa-circle"></i> <i className="fa fa-circle"></i> <i className="fa fa-circle"></i>Volver atrás</button>
                        </div>

                    </div>

                </div >
            )}

        </>
    )
}

export default SingleMovie;