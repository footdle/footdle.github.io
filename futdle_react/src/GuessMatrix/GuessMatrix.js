import React from "react";
import { useState, useEffect, useRef} from "react";
import "./GuessMatrix.css"

export default function GuessMatrix ({guesses, answer}) { 

    return (
        <>
            <table cellSpacing="0">
                <thead>
                <tr className="theader">
                    <td className="gencell">PLR</td>
                    <td className="gencell">POS</td>
                    <td className="gencell">LIG</td>
                    <td className="gencell">NAT</td>
                    <td className="gencell">CLB</td>
                </tr>

                </thead>
                <tbody>

                
                
                {guesses.slice(0).reverse().map((player, item) => 

                    
                        <tr key={player['key']} className="trows">
                            <td>

                            <span className="iteminrow"> {<img src={player['img']}  />}</span>

                            </td>
                            <td className={player.pos == answer.pos ? 'goodGuess' : 'badGuess'} >{player.pos}</td>
                            <td className={player.lig == answer.lig ? 'goodGuess' : 'badGuess'}>{ <img className="leftSideIconPic" src={process.env.PUBLIC_URL + player['lig_url']}  /> }</td>
                            <td className={player.nat == answer.nat ? 'goodGuess' : 'badGuess'}>{ <img className="flagIMG" src={`https://flagcdn.com/w80/${player['nat'].toLowerCase()}.png`}  />}</td>
                            <td className={player.tim == answer.tim  ? 'goodGuess' : 'badGuess'}>{ <img src={player['tim_url']} /> }</td>
                        </tr>
                    
                )}

            </tbody>

            </table>
        </>
    )
}