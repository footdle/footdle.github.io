import React from "react";
import { useState, useEffect, useRef} from "react";
// import './KitSearchBar.css';

export default function KitGuesses ({guesses, answer}) { 

    const get_year_emoji = (guess, answer) => {
        // if guess year is greater than answer year, return an upward emoji
        if(guess[1] < answer['year']){
            return "🔼"
        }
        // if guess year is less than answer year, return a downward emoji
        else if(guess[1] > answer['year']){
            return "🔽"
        }
        // if guess year is equal to answer year, return a tick emoji
        else{
            return "✅"
        }
    }

    const get_club_emoji = (guess, answer) => {
        // if guess year is greater than answer year, return an upward emoji
        if(guess == answer){
            return "✅"
        }
        else{
            return "❌"
        }
    }

    return (
        <>
    {console.log({answer, guesses})}

        <table>
            <tr>
                <td>
                    Club
                </td>
                <td>
                    Year
                </td>
            </tr>
            {guesses.map( (guess, index) => {
                return <tr>
                    <td>
                        <span style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                            <img src={"kit_dir/"+guess[1]+"_"+guess[0].toLowerCase().replace(" ", "_")+"_kit.png"} /> {get_club_emoji(guess[0], answer['club'])}
                        </span>
                    </td>
                    <td>
                        {guess[1] + " " + get_year_emoji(guess, answer)}
                    </td>
                    
                </tr>
            })}
            
        </table>
        </>

)
}