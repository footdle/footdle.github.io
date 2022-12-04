import React from "react";
import { useState, useEffect, useRef} from "react";
import './CurrentPlayerView.css';
import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export default function CurrentPlayerViewer ({selectedPlayer, submitPlayer, onclick, setPlayerMatches}) { 

    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");

    let [club_loaded, setClubLoaded] = useState(false);
    let [player_loaded, setPlayerLoaded] = useState(false);

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
                <span className="iteminrow"> {selectedPlayer['position']} </span>
                <img style = {player_loaded?{}:{'display':'none'}} className='img_name_img' src={"https://footdle.com/images/player_imgs_small/"+selectedPlayer['img_id']+".png"}
                    referrerPolicy="no-referrer"
                    onLoad={() => {setPlayerLoaded(true)}}
                    />
                <span className="iteminrow"> {<img src={"https://footdle.com/images/club_imgs/"+selectedPlayer['club_id']+".png"} />}</span>
                <span className="iteminrow">

                {!player_loaded ? <ClipLoader color={color} loading={loading} size={'5vh'} /> : ''}
                
                <img  src={"https://footdle.com/images/nat_imgs/"+selectedPlayer['country_code']+".png"} />
                </span>
                <span className="iteminrow"> {selectedPlayer['short_name']} </span>

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