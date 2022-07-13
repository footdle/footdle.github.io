import React from "react";
import { useState, useEffect, useRef} from "react";
import attackers from "../attackers_with_stats.json";
import "./HigherLowerRenderer.css"

export default function HigherLowerRenderer ({leftAttacker, rightAttacker, statistic, selectedFunction, lost}) {

    const [showingStats, setShowingStats] = useState(false);
    const getEmoji = (n1, n2) => {
        if (n1 > n2) {
            return "⬆️";
        } else if (n1 < n2) {
            return "⬇️";
        } else {
            return "="
        }
    }

    const readable_key = {
        'goals' : 'goals',
        'assists' : 'assists',
        'mins' : 'minutes played',
        'penalties' : 'penalties scored',
        'fouls_made' : 'fouls made',
        'fouls_won' : 'fouls won',
        'yellow_cards' : 'yellow cards',
        'crosses' : 'crosses',
        'offsides' : 'offsides',
        'interceptions' : 'interceptions'
    }

    return     <div className='hl_outer_holder'>
        <span>
            Who has the most <span className="statistic">{readable_key[statistic]}</span>?
        </span>
        <div className={'higherLowerHolder'} style  ={{display:'flex', justifyContent:'space-around'}}>
            <div className="hl_player_holder">
                <p className={'leftIndicator ' + (showingStats || lost ? 'showing':'hidden') }>
                    {getEmoji(leftAttacker[statistic], rightAttacker[statistic] )} {leftAttacker[statistic]}
                </p>
                <img className={'hl_player_img ' + ((lost || showingStats) && (leftAttacker[statistic] < rightAttacker[statistic]) ? 'darken':'')} src={leftAttacker['img']} />


                    <button disabled={showingStats || lost} className='thisPlayer' onClick={(e) => {
                        setShowingStats(true); 
                        
                        setTimeout(() => {

                            selectedFunction(leftAttacker, rightAttacker, statistic)
                            setShowingStats(false); 

                        }, 2000)
                    }}>{
                        typeof leftAttacker['nam'] !== 'undefined' ? 
                    leftAttacker['nam'].toUpperCase() : ''} </button>
            </div>
            <div className="hl_player_holder">
                <p className={'leftIndicator ' + (showingStats || lost ? 'showing':'hidden')}>
                {getEmoji(rightAttacker[statistic], leftAttacker[statistic] )} {rightAttacker[statistic]}
                </p>
                    <img className={'hl_player_img ' + ((showingStats || lost) && (leftAttacker[statistic] > rightAttacker[statistic]) ? 'darken':'')} src={rightAttacker['img']} />

                    <button disabled={showingStats || lost} className='thisPlayer' onClick={(e) => {
                        setShowingStats(true); 
                        
                        setTimeout(() => {
                            selectedFunction(rightAttacker, leftAttacker, statistic)
                            setShowingStats(false); 

                        }, 2000)
                    }}>{
                        typeof rightAttacker['nam'] !== 'undefined' ? 
                        
                    rightAttacker['nam'].toUpperCase() : ''}</button>

            </div>

        </div>

    </div>
}