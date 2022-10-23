import React from "react";
import './TTY_gm.css'
import {useState} from "react"



export default function ThroughTheYearsRenderer ({guesses, answer}) { 

    const answer_id = answer.length==0 ? 0 : Object.values(answer)[0]['player_id']

    const guessed = (guess) => {
        // return a check emoji if the guess is the same as the answer
        if (guess['img_id'] == answer_id){
            return "✅"
        }

        // return a check emoji if the guess is the same as the answer
        if (guess['img_id'] != answer_id){
            return "❌"
        }
        
    }

    return (
        <>  
        <div className="tty_guess_matrix">

                {
                        guesses.reverse().map((guess, index) => {
                            return <span id={index+1 == guesses.length ? "last_one_tty" : ""} className="tty_guess_matrix_row"> <span className="indicator">#{index+1}</span> <img src= {"https://footdle.com/images/player_imgs_small/"+guess['img_id']+".png"}/> {guessed(guess)} <br/></span>
                        })
                    }
        </div>
        </>
    )
}