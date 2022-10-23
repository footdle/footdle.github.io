import React from "react";
import "./TTY_pr.css";


export default function ThroughTheYearsPlayerRenderer ({player, hintCount, lastOne}) { 

    function overall_to_color(overall){
        if (overall < 65){
            return "bronze"
        } else if (overall < 75){
            return "silver"
        } else {
            return "gold"
        }
    }

    return (
        <>  
            <div id={lastOne?'last_player':''} className={'tty_player_holder '+overall_to_color(player['overall'])}>
                <p className='tty_player_detail'> {player['overall']}  {player['position']} </p>
                <p className='tty_player_detail'> {(hintCount >= 2) || (lastOne && (hintCount >= 1)) ? <img className="tty_card_img" src={"http://footdle.com/images/big/clubs/"+player['club_id']+".png"}/>:'' } 
                {/* {hintCount>= 1? <br/> : ''} */}
                {hintCount >=3 ? <img className="tty_card_img" src={"http://footdle.com/images/big/nats/"+player['country_id']+".png"} /> : ''  }</p>
                <p className='tty_player_detail'> FIFA {player['year']} </p>
            </div>
        </>
    )
}