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
                            
                            <span className="iteminrow"> {<img src={"https://footdle.com/images/player_imgs_small/"+player['img_id']+".png"}  />}</span>

                            </td>
                            <td className={player.position == answer.position ? 'goodGuess' : 'badGuess'} >{player.position}</td>
                            <td className={player.league == answer.league ? 'goodGuess' : 'badGuess'}>{ <img className="leftSideIconPic" src={process.env.PUBLIC_URL + player['league']}  /> }</td>
                            <td className={player.country_code == answer.country_code ? 'goodGuess' : 'badGuess'}>{ <img className="flagIMG" src={"https://footdle.com/images/nat_imgs/"+player['country_code']+".png"}  />}</td>
                            <td className={player.club_id == answer.club_id  ? 'goodGuess' : 'badGuess'}>{ <img src={"https://footdle.com/images/club_imgs/"+player['club_id']+".png"} /> }</td>
                        </tr>
                    
                )}

            </tbody>

            </table>
        </>
    )
}