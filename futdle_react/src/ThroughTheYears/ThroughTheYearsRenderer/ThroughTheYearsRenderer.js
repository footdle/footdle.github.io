import React from "react";
import ThroughTheYearsPlayerRenderer from "../ThroughTheYearsPlayerRenderer/ThroughTheYearsPlayerRenderer";
import SearchBar from "../ThroughTheYearsSearchBar/ThroughTheYearsSearchBar";
import './TTY.css'
import players from '../../answer_pool.json' 
import {useState} from "react"
import CurrentPlayerViewer from "../../Classic/CurrentPlayerView/CurrentPlayerViewer";
import ThroughTheYearsGuessMatrix    from '../ThroughTheYearsGuessMatrix/ThroughTheYearsGuessMatrix';
import { useEffect } from "react";



export default function ThroughTheYearsRenderer ({answer, out_of_guesses, won, toast_f}) { 
    const [guessCount, setGuessCount] = useState(0)
    const [clearField, setClearField] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState(undefined)
    const [hintCount, setHintCount] = useState(0)
    const [guesses, setGuesses] = useState([])
    const [currentGuess, setCurrentGuess] = useState({})
    const guessLimit = 7

    const answer_id = answer.length==0 ? 0 : Object.values(answer)[0]['player_id']

    const guessed = (guess) => guess['img_id'] == answer_id

    function makeEmptyGuess () {
        setGuessCount(guessCount + 1)
        setClearField(true)
        setSelectedPlayer(undefined)
    }

    function makeGuess(guess){
        setGuesses(prevState => [...prevState, guess])

        if(guessed(guess)){
            won(guesses, hintCount, true)
        }else{
            if(guesses.length + 1 >= guessLimit){
                won(guesses, hintCount, false)

            }
        }
        
        try{

            // timeout
            setTimeout(() => {
                var last_one = document.getElementById( 'last_one_tty' );
                last_one.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100)
            

        }catch(Exception){
            console.log("error")
        }

        setClearField(true)
        setSelectedPlayer(undefined)
    }

    function giveClueFunction(){
        if(hintCount == 0){
            const last_one = document.getElementById( 'last_player' );
            last_one.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
        setHintCount(hintCount + 1)
    }

    return (
        <>  
        <div className="tty_outer_holder">

            <div className="detailsHolder">

                {
                // iterate over the last 6 ekements of the array
                Object.values(answer).map((player, index) => {
                    return <ThroughTheYearsPlayerRenderer hintCount = {hintCount} player={player} lastOne={(index+1) == Object.values(answer).length} />
                })}

            </div>

            <div className="tty_inner_holder">
                <div className="tty_lhs_holder">
                <div>

                    
                    </div>
                    <p> Attempts {guesses.length}/{guessLimit}</p>
                    <ThroughTheYearsGuessMatrix guesses={guesses} answer={answer} />
                </div>

                <div className="tty_rhs_holder">
                    <div className='tty_changing'>

                        <div style={{display:'flex', flexDirection:'row'}}>
                            <span style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <SearchBar players = {players} clearField={clearField} updateClearField={setClearField} gameActive={true} selectPlayerFunction={setSelectedPlayer} setSelectedPlayer={setSelectedPlayer} giveClueFunction={makeEmptyGuess} hintCount={hintCount} guessCount={guesses.length} />
                            </span>
                            <button className={"tty_clue"} onClick={giveClueFunction} disabled={hintCount >= 4}> Give <br></br> Hint </button>

                        </div>

                        <CurrentPlayerViewer selectedPlayer = {selectedPlayer} submitPlayer={makeGuess} onclick={undefined} setPlayerMatches={undefined}/>

                    </div>

                </div>
            </div>

        </div>
        </>
    )
}