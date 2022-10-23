import React from "react";
import { useState, useEffect, useRef} from "react";
import player_information from "../guess_who_data/player_information.json"
import "./GuessWhoPlayerRenderer.css"
import club_info from "../guess_who_data/club_information.json"

export default function GuessWhoPlayerRenderer ({player, show_club, hidden}) {


    return         <span className={'guess_who_player_holder ' + (hidden ? "hidden":"")}>
            <div>
                <img className='guess_who_player_img' src={player_information[player[0]]['img_url']} />
            </div>
            <div className="guess_who_name_text">
                {player_information[player[0]]['short_name']}
            </div>
            
            {
                player[1] in club_info ? 
                <img className={'guess_who_clubs ' + (!show_club? "hidden":"" )} src={club_info[player[1]]['club_url']}></img>
            :''}

        

    </span>
}
