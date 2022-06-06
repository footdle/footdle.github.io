import React from "react";
import { useState, useEffect, useRef} from "react";
import './IconCurrentPlayerView.css';


export default function IconCurrentPlayerViewer ({selectedPlayer, submitPlayer, onclick, setPlayerMatches}) { 

    const playerIDs = ['246525','246514','246497','248451','256015','246516','247554','246472','246535','246526','246524','246519','261995','247326','258862','246513','246493','255911','246528','246541','255478','246521','246534','246489','246522','246505','246503','256340','246499','246492','246509','261997','261998','246485','246515','254572','246518','246490','246491','246527','247548','247302','246529','246478','247615','246477','247702','255359','246532','246530','246531','247299','246496','246537','246540','246533','246539','247694','256433','256155','247705','256871','246523','246483','246498','246482','246479','246486','246494','246488','246487','246502','246474','262199','246511','246517','246512','246475','246481','246480','246543','247300','246538','246500','247306','246476','246504','246506','246507','246501','255759','246508','246510','246495','246520','250892','246484','257418','255356','247516','246544','246545','248156','246542']
    const playerNTs = ['54', '52', '54', '18', '23', '34', '54', '54', '27', '40', '35', '34', '54', '54', '14', '27', '27', '45', '45', '38', '18', '34', '21', '18', '14', '45', '38', '21', '27', '52', '9', '45', '14', '50', '14', '52', '45', '27', '34', '27', '83', '34', '34', '34', '27', '54', '42', '103', '13', '34', '18', '54', '12', '18', '21', '54', '27', '108', '12', '21', '50', '45', '13', '14', '34', '14', '18', '14', '18', '18', '14', '21', '49', '34', '45', '54', '39', '38', '14', '27', '52', '45', '46', '52', '117', '27', '18', '18', '133', '17', '51', '38', '83', '14', '34', '27', '25', '10', '14', '14', '14', '27', '14', '163']

    
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
                <span className="iteminrow"> {selectedPlayer['rat']} </span>
                <span className="iteminrow"> {selectedPlayer['pos']} </span>
                <img className="iconLeftSidePic"src={'players\\'+playerIDs[selectedPlayer.id]+".webp"}></img>
                <img className="iconLeftSidePic"src={'flags\\f_'+playerNTs[selectedPlayer.id]+".png"}></img>
                <span className="iteminrow" > {selectedPlayer['name']} </span>

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