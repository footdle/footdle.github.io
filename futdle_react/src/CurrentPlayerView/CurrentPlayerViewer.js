import React from "react";
import { useState, useEffect, useRef} from "react";
import './CurrentPlayerView.css';


export default function CurrentPlayerViewer ({selectedPlayer, submitPlayer, onclick, setPlayerMatches}) { 

    
    return (
        <>
        {selectedPlayer != null ? 
        
        <div 
        onClick={(e) =>{
            if(onclick != undefined){
                onclick(selectedPlayer)
                setPlayerMatches([])
            }
        }}
        className={`current_row ${submitPlayer != undefined ? 'need_bg' : ""}`}> 
            <div className="currentPlayerView">
                <span className="iteminrow"> {selectedPlayer['pos']} </span>
                <img className='img_name_img' src={selectedPlayer['img']}
                    referrerPolicy="no-referrer"
                    />
                <span className="iteminrow"> {<img src={selectedPlayer['tim_url']} />}</span>
                <span className="iteminrow">
                <img  src={`https://flagcdn.com/w80/${selectedPlayer['nat'].toLowerCase()}.png`} />
                </span>
                <span className="iteminrow"> {selectedPlayer['nam']} </span>

                {/* <span className="iteminrow"> {selectedPl    ayer['lig']} </span> */}
            
            </div>

            {submitPlayer != undefined ? <button className="submitButton" onClick={(e) => submitPlayer(selectedPlayer)}>
                Make Guess
            </button> : "" }
            
             </div>
         : "" }
       
        </>
    )
}