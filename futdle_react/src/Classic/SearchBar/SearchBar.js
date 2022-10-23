import React from "react";
import { useState, useEffect, useRef} from "react";
import './SearchBar.css';
import CurrentPlayerViewer from '../CurrentPlayerView/CurrentPlayerViewer';


export default function SearchBar ({players, selectPlayerFunction, clearField, updateClearField, gameActive, setSelectedPlayer}) { 
    const search_text_ref = useRef()
    const [search_text, setSearchText] = useState(search_text_ref.current);
    const [matches, setPlayerMatches] = useState([])

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

        let temp = []
        for( let i = 0; i < players.length; i ++){
            let player = players[i]

            if(player['short_name'].normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().includes(text.toLowerCase()) || player['full_name'].normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().includes(text.toLowerCase())){
                temp.push(player)
            }
        }

        setPlayerMatches(temp)
    }

    return (
        <>
        <input
        className="playerInput"
        disabled={!gameActive}

        ref={search_text_ref}
        onChange={updateSearchRef}
        placeholder="Player name"
        type="text"

        />
        
        { matches.length > 0 ? 
            <div className="results">
        

                {matches.slice(0, 10).map((item, k) => {
                    return <div key={item['key']}>
                    <CurrentPlayerViewer  key={item['key']} selectedPlayer={item} submitPlayer={undefined} onclick={selectPlayerFunction} 
                                        setPlayerMatches={setPlayerMatches}/>
                    
                    {k < matches.length-1 ? <hr></hr>:""}
                    </div>
                } 
                    
                ) 
            }

            </div> 
            : ""
        }
        </>
    )
}