import React from "react";
import { useState, useEffect, useRef} from "react";
import './GuessWhoSearchBar.css';
import GuessWhoCurrentPlayerViewer from '../GuessWhoCurrentPlayerViewer/GuessWhoCurrentPlayerViewer';
import player_information from '../guess_who_data/player_information.json';
import PerfectScrollbar from 'react-perfect-scrollbar'

export default function SearchBar ({selectPlayerFunction, clearField, updateClearField, gameActive, setSelectedPlayer, giveClueFunction, hintCount, guessCount}) { 
    const search_text_ref = useRef()
    const [search_text, setSearchText] = useState(search_text_ref.current);
    const [matches, setPlayerMatches] = useState([])
    const players = Object.values(player_information).map(player => player);

    useEffect( () =>{
        search_text_ref.current.value = null
        updateClearField(false)
    }, [clearField])

    const updateSearchRef = (e) => {

        setSelectedPlayer(undefined)
        let text = search_text_ref.current.value.toLowerCase().trim()
        setSearchText(search_text_ref.current.value)

        if(text == "") {
            setPlayerMatches([])
            return []
        }

        let temp = players.filter((player) => {
            let converted_short = player['short_name'].normalize("NFD").replace(/\p{Diacritic}/gu, "")
            let converted_long = player['full_name'].normalize("NFD").replace(/\p{Diacritic}/gu, "")
            return converted_short.toLowerCase().includes(text) || converted_long.toLowerCase().includes(text)
        })

        setPlayerMatches(temp)
    }

    return (
        <>
        <div className="guess_who_search_row">

            <input
            className="guessWhoPlayerInput"
            disabled={!gameActive}
            
            ref={search_text_ref}
            onChange={updateSearchRef}
            placeholder="Player name"
            type="text"
            
            />

            <button className={"giveGlueButton"} onClick={giveClueFunction} disabled={hintCount >= 2}> Give <br></br> Hint </button>
        </div>

        
        { matches.length > 0 ? 
            <div className="outerResuts" style={{width:"100%", height:"100%", textAlign:'center'}}>
            <div className="results" style={{display:'inline-block'}}>

                {matches.slice(0, 10).map((item, k) => {
                    return <div key={item['key']}>
                    <GuessWhoCurrentPlayerViewer selectedPlayer={item} submitPlayer={undefined} onclick={selectPlayerFunction} 
                                        setPlayerMatches={setPlayerMatches}/>
                    
                    {k < matches.length-1 ? <hr></hr>:""}
                    </div>
                } 
                
                ) 
            }
            </div> 
            </div>
            : ""
        }
        </>
    )
}