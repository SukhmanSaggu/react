import React from 'react';
import Hero from "../components/Hero.jsx";
import Joblisting from "../components/JobsListing.jsx";
import Viewalljob from '../components/viewalljob.jsx'
import Homecard from "../components/HomeCards.jsx";

console.log('hello homepage');


const HomePage = ({ isAdminSignedIn }) => {
    return (
        <>

            <Hero/>
            <Homecard isAdminSignedIn={isAdminSignedIn}/>
            <Joblisting/>
            <Viewalljob/>
        </>
    );
};

export default HomePage;
