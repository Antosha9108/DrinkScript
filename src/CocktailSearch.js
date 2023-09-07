// src/CocktailSearch.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './tailwind.css'; // Import Tailwind CSS


function CocktailSearch() {
    const [cocktailName, setCocktailName] = useState('');
    const [cocktailData, setCocktailData] = useState([]);
    const [showMore, setShowMore] = useState(false);




    // In this updated code:

    // We import the useCallback hook from React.
    // We wrap the fetchCocktailData function definition in a useCallback hook, passing [cocktailName] as its dependency array. This ensures that fetchCocktailData remains the same function between renders, but it will recompute when cocktailName changes.
    // We include fetchCocktailData in the dependency array of the useEffect to fix the warning.
    // By using useCallback, you're telling React that the function should only change if its dependencies (in this case, cocktailName) change. This eliminates the warning and ensures that the effect behaves correctly.


    // Wrap fetchCocktailData in useCallback
    const fetchCocktailData = useCallback(async () => {
        try {
            const response = await axios.get(
                `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`
            );
            const drinks = response.data.drinks || [];
            setCocktailData(drinks);
            setShowMore(drinks.length > 1); // Enable "Show More" button if there's more than one drink
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [cocktailName]);


    // this code renders new cocktails immediately when input is typed without a click of search button. If using this, comment out the search button and fix the border radius of input from rounded-l-lg to rounded-lg
    useEffect(() => {
        // Fetch data only if cocktailName is provided
        if (cocktailName) {
            fetchCocktailData();
        }
    }, [cocktailName, fetchCocktailData]);


    const handleShowMore = () => {
        setShowMore(false); // Hide "Show More" button after it's clicked
    };
    // 
    return (
        <div className="font-roboto ">
            <h1 className="font-semibold text-xl text-rose-500 my-8">DrinkScript</h1>
            <input
                type="text"
                placeholder="Enter cocktail name"
                value={cocktailName}
                onChange={(e) => setCocktailName(e.target.value)}
                className='px-4 py-2 mb-8 bg-gray-800/70 text-slate-100 rounded-lg focus:outline-none border border-gray-700/70 focus:border-rose-500 drop-shadow-lg'
            />
            {/* uncomment this search button and comment out useEffect on line 39 if want to render result onClick only */}
            {/* <button onClick={fetchCocktailData} className="bg-rose-500 text-white px-4 py-2 mb-8 rounded-r-lg border  border-rose-500 drop-shadow-lg">Search</button> */}
            {
                cocktailData.length > 0 && (
                    <div className=' text-slate-100 border border-gray-700 my-8 rounded-lg bg-gray-800/70 backdrop-opacity-10 divide-y divide-gray-800/70 drop-shadow-lg max-w-lg min-w-xs sm:mx-auto m-10 min-w-[250px]'>
                        {/* Cocktail name */}
                        <p className='text-lg font-bold p-4'>{cocktailData[0].strDrink}</p>

                        {/* Cocktail image */}
                        <img className='mx-auto rounded-lg mb-4 border border-gray-800/70 drop-shadow-lg'
                            src={cocktailData[0].strDrinkThumb}
                            alt={cocktailData[0].strDrink}
                            style={{ maxWidth: '200px' }}
                        />



                        <h3 className='mx-10 py-2'>Ingredients</h3>

                        <ul className='mx-10'>
                            {Array.from({ length: 15 }).map((_, index) => {
                                const ingredientKey = `strIngredient${index + 1}`;
                                const measurementKey = `strMeasure${index + 1}`;
                                const ingredient = cocktailData[0][ingredientKey];
                                const measurement = cocktailData[0][measurementKey];
                                if (ingredient && measurement) {
                                    return (
                                        <li key={index}>
                                            {measurement} {ingredient}
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ul>



                        <p className='font-roboto mx-10 py-2'>Preparation</p>
                        <p className='font-roboto mx-10 py-2'>{cocktailData[0].strInstructions}</p>


                    </div>
                )
            }
            {
                showMore && (
                    <button onClick={handleShowMore} className="bg-rose-500 text-white px-4 py-2 mb-8 rounded drop-shadow-lg">
                        Show More
                    </button>
                )
            }
            {
                showMore === false && cocktailData.length > 1 && (
                    <div >
                        {cocktailData.slice(1).map((cocktail) => (
                            <div key={cocktail.idDrink} className=' text-slate-100 border border-gray-700 my-10 rounded-lg bg-gray-800/70 backdrop-opacity-10 divide-y divide-gray-800/70 drop-shadow-lg max-w-lg sm:mx-auto mx-10'>
                                {/* Cocktail name */}

                                <h3 className='mx-10 py-2 text-lg font-bold'>{cocktail.strDrink}</h3>
                                {/* Cocktail Image */}
                                <img
                                    className='mx-auto rounded-lg mb-4 border border-gray-800/70 drop-shadow-lg'
                                    src={cocktail.strDrinkThumb}
                                    alt={cocktail.strDrink}
                                    style={{ maxWidth: '200px' }}
                                />


                                <h4 className='mx-10 py-2' >Ingredients</h4>
                                <ul className='mx-10'>
                                    {Array.from({ length: 15 }).map((_, index) => {
                                        const ingredientKey = `strIngredient${index + 1}`;
                                        const measurementKey = `strMeasure${index + 1}`;
                                        const ingredient = cocktail[ingredientKey];
                                        const measurement = cocktail[measurementKey];
                                        if (ingredient && measurement) {
                                            return (
                                                <li key={index}>
                                                    {measurement} {ingredient}
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                                </ul>
                                <p className='font-roboto mx-10 py-2'>Preparation</p>
                                <p className='font-roboto mx-10 py-2'>{cocktail.strInstructions}</p>


                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
}

export default CocktailSearch;
