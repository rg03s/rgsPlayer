import { useState, useEffect } from "react";
import Loading from "react-loading";
import { useParams } from "react-router-dom";

function searchTrailer(movieName) {
    const API_KEY = "AIzaSyCdIGnqNmNc6Ih3ny2dj7U43tJAfaiyC_I";
    const category = "";
    const searchQuery = `trailer pelicula ${movieName}`;
    console.log(searchQuery);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&type=video&order=viewCount&relevanceLanguage=es&key=${API_KEY}`;

    return fetch(url).then((response) => response.json()).then((data) => {
        const videoId = data.items[0].id.videoId;
        return `https://www.youtube.com/embed/${videoId}`;
    });
}

function Trailer({ }) {
    const [trailerUrl, setTrailerUrl] = useState("");
    const [translated_title, setTranslatedTitle] = useState("");
    const movie = useParams();

    useEffect(() => {

        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${movie.title}`)
        .then((response) => response.json())
        .then((res) => {
            if (res && res[0] && res[0][0]) {
                setTranslatedTitle(res[0][0][0]);
                console.log(translated_title);
                searchTrailer(translated_title).then((url) => {
                    setTrailerUrl(url);
                });
            } else {
                setTranslatedTitle("");
            }
        });

    }, [movie, translated_title]);

    return (
        <>
            {trailerUrl ? (
                <iframe
                    width="90%"
                    height="90%"
                    src={trailerUrl}
                    title="Trailer"
                    allowFullScreen
                ></iframe>
            ) : (
                <Loading type="spin" height={450} width={300} color={"var(--primary-color)"} />
            )}
        </>
    );
}

export default Trailer;