import React from 'react';
import Hero from "../components/Hero.jsx";
import Joblisting from "../components/JobsListing.jsx";
import Viewalljob from '../components/viewalljob.jsx'
import Homecard from "../components/HomeCards.jsx";

console.log('hello homepage');


const HomePage = () => {
    return (
        <>

            <Hero/>
            <Homecard/>
            <Joblisting/>
            <Viewalljob/>
        </>
    );
};

export default HomePage;
