import { sampleMovies } from "../component/data/sampleData";

export default function FeaturedMovies(){
    let featureMovie;
    featureMovie = sampleMovies.slice(1,5);
    // console.log(featureMovie)
    return featureMovie; 
}