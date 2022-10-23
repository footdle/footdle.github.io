import React from "react";
import { useState, useEffect, useRef} from "react";
import "./IconGuessMatrix.css"

export default function IconGuessMatrix ({guesses, answer}) { 

    const getSymbol = (guess, answer) => {
        // if the guess is higher than the answer, return a down arrow emoji
        if(guess > answer){
            return '\u2B07'
        }
        // if the guess is lower than the answer, return an up arrow emoji
        else if(guess < answer){
            return '\u2B06'
        }
        // if the guess is the same as the answer, return a checkmark emoji]
        else{
            return '\u2705'
        }
    }

    return (
        <>
            <table cellSpacing="0">
                <thead>
                <tr className="theader">
                    <td className="gencell">POS</td>
                    <td className="gencell">PAC</td>
                    <td className="gencell">SHO</td>
                    <td className="gencell">PAS</td>
                    <td className="gencell">DRI</td>
                    <td className="gencell">DEF</td>
                    <td className="gencell">PHY</td>
                </tr>

                </thead>
                <tbody>

                
                
                {guesses.slice(0).reverse().map((player, item) => 

                    
                        <tr key={player['key']} className="trows">
                            {/* <td>

                            <span className="iteminrow"> {<img src={player['img']}  />}</span>
                            </td> */}
                            <td className={player.pos == answer.pos ? 'goodGuess' : 'badGuess'} >{player.pos}</td>
                            <td className={player.pac == answer.pac ? 'goodGuess' : 'badGuess'} >{getSymbol(player.pac, answer.pac)}</td>
                            <td className={player.sho == answer.sho ? 'goodGuess' : 'badGuess'} >{getSymbol(player.sho, answer.sho)}</td>
                            <td className={player.pas == answer.pas ? 'goodGuess' : 'badGuess'} >{getSymbol(player.pas, answer.pas)}</td>
                            <td className={player.dri == answer.dri ? 'goodGuess' : 'badGuess'} >{getSymbol(player.dri, answer.dri)}</td>
                            <td className={player.def == answer.def ? 'goodGuess' : 'badGuess'} >{getSymbol(player.def, answer.def)}</td>
                            <td className={player.phy == answer.phy ? 'goodGuess' : 'badGuess'} >{getSymbol(player.phy, answer.phy)}</td>
                        </tr>
                    
                )}

            </tbody>

            </table>
        </>
    )
}