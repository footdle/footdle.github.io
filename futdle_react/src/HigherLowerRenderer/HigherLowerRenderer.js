import React from "react";
import { useState, useEffect, useRef} from "react";
import attackers from "../attackers_with_stats.json";
import "./HigherLowerRenderer.css"

export default function HigherLowerRenderer ({leftAttacker, rightAttacker, statistic, selectedFunction}) {

    return     <div className='hl_outer_holder'>
        <span>
            Who has the most <span className="statistic">{statistic}</span>?
        </span>
        <div className={'higherLowerHolder'} style  ={{display:'flex', justifyContent:'space-around'}}>
            {console.log( leftAttacker[statistic], rightAttacker[statistic])}
            <div className="hl_player_holder">
                <img className={'hl_player_img'} src={leftAttacker['img']} />


                    <button className='thisPlayer' onClick={(e) => selectedFunction(leftAttacker, rightAttacker, statistic)}>{
                        typeof leftAttacker['nam'] !== 'undefined' ? 
                    leftAttacker['nam'].toUpperCase() : ''} </button>
            </div>
            <div className="hl_player_holder">
                    <img className={'hl_player_img'} src={rightAttacker['img']} />

                    <button className='thisPlayer' onClick={(e) => selectedFunction(rightAttacker, leftAttacker, statistic)}>{
                        typeof rightAttacker['nam'] !== 'undefined' ? 
                        
                    rightAttacker['nam'].toUpperCase() : ''}</button>

            </div>

        </div>

    </div>
}