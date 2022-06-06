import React from "react";
import { useState, useEffect, useRef} from "react";
import "./GuessMatrix.css"

export default function OpponentMatrix ({guess}) { 

    return (
        <>
            <table cellSpacing="0">
                <thead>
                <tr className="theader">
                    <td className="gencell">POS</td>
                    <td className="gencell">LIG</td>
                    <td className="gencell">NAT</td>
                    <td className="gencell">CLB</td>
                </tr>

                </thead>
                <tbody>

                {typeof guess === "undefined" ?
                <tr className="trows">
                    <td className={'badGuess'}> <br/></td>
                    <td className={'badGuess'}> <br/></td>
                    <td className={'badGuess'}> <br/></td>
                    <td className={'badGuess'}> <br/></td>
                </tr>
                :
                <tr className="trows">
                    <td className={guess[0] >= 1 ? 'goodGuess' : 'badGuess'} > <br/></td>
                    <td className={guess[1] >= 1 ? 'goodGuess' : 'badGuess'}><br/></td>
                    <td className={guess[2] >= 1 ? 'goodGuess' : 'badGuess'}> <br/></td>
                    <td className={guess[3] >= 1  ? 'goodGuess' : 'badGuess'}><br/></td>
                </tr>
                }
                

            </tbody>

            </table>
        </>
    )
}