import React from "react";
import { useState, useEffect, useRef} from "react";
import "./IconCardGuessMatrix.css"




export default function IconCardGuessMatrix ({guesses, answer, demo}) {
    const playerIDs = ['246525','246514','246497','248451','256015','246516','247554','246472','246535','246526','246524','246519','261995','247326','258862','246513','246493','255911','246528','246541','255478','246521','246534','246489','246522','246505','246503','256340','246499','246492','246509','261997','261998','246485','246515','254572','246518','246490','246491','246527','247548','247302','246529','246478','247615','246477','247702','255359','246532','246530','246531','247299','246496','246537','246540','246533','246539','247694','256433','256155','247705','256871','246523','246483','246498','246482','246479','246486','246494','246488','246487','246502','246474','262199','246511','246517','246512','246475','246481','246480','246543','247300','246538','246500','247306','246476','246504','246506','246507','246501','255759','246508','246510','246495','246520','250892','246484','257418','255356','247516','246544','246545','248156','246542']
    const playerNTs = ['54', '52', '54', '18', '23', '34', '54', '54', '27', '40', '35', '34', '54', '54', '14', '27', '27', '45', '45', '38', '18', '34', '21', '18', '14', '45', '38', '21', '27', '52', '9', '45', '14', '50', '14', '52', '45', '27', '34', '27', '83', '34', '34', '34', '27', '54', '42', '103', '13', '34', '18', '54', '12', '18', '21', '54', '27', '108', '12', '21', '50', '45', '13', '14', '34', '14', '18', '14', '18', '18', '14', '21', '49', '34', '45', '54', '39', '38', '14', '27', '52', '45', '46', '52', '117', '27', '18', '18', '133', '17', '51', '38', '83', '14', '34', '27', '25', '10', '14', '14', '14', '27', '14', '163']

    const getSymbol = (guess, answer) => {
        // if the guess is higher than the answer, return a down arrow emoji
        if(guess > answer){
            return '🔻'
        }
        // if the guess is lower than the answer, return an up arrow emoji
        else if(guess < answer){
            return '🔺'
        }
        // if the guess is the same as the answer, return a checkmark emoji]
        else{
            return '\u2705'
        }
    }

    const getSymbolMatch = (guess, answer) => {
        // if the guess is equal to the answer, return a check mark emoji
        if(guess === answer){
            return '\u2705'
        }else{
            // return an X emoji
            return '\u274C'
        }
    }

    return <div style={{overflowY:"auto", overflowX:"hidden", height: demo == false ? "70vh":"", position:"relative"}}> {guesses.slice(0).reverse().map((guess, index) => {
                    return <>

                        {
                            demo == false ?
                            <div style={{display:'flex', alignItems:'center'}}>
                                {"Attempt " + (guesses.length-(index))}<br></br>
                                {/* <span style={{display:'flex'}}>ICON League: 
                                
                                { guess['lig_url'] != '??' ? <img className="leftSideIcon" src={process.env.PUBLIC_URL + guess['lig_url']} /> : "??"}
                                </span> */}
                            </div>
                            : ""
                        }
                        <div className="cardHolderIcon">
                        <div className="iconBG" style={{
                                backgroundImage: "url('players/"+playerIDs[guess['id']]+".webp')",
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                position: 'absolute',
                                width: '66%',
                                height: '59%',
                                marginTop: '14%'
                            }}></div>
                            <div className="topSideIcon">
                                <div className="leftSideIcon">
                                    <span>
                                    {getSymbol(guess.rat, answer.rat) + " " + guess.rat} <br></br>
                                    {getSymbolMatch(guess.pos, answer.pos) + " " + guess.pos}<br></br>
                                    {getSymbolMatch(playerNTs[guess.id], playerNTs[answer.id]) }<img src={'flags\\f_'+playerNTs[guess.id]+".png"}></img><br></br>
                                    </span>
                                </div>

                                <div className="midSide">
                                    <span>
                                        {guess.name}
                                    </span>
                                </div>
                            </div>

                            <div className="botSideIcon" style={{width:"100%", textAlign:"center", marginTop:"0em", height:"35%", marginLeft:"2em"}}>
                                <table style={{fontSize:"3vh"}}>
                                    <tr>
                                        <td>
                                            {getSymbol(guess.pac, answer.pac) + " " + guess.pac}
                                        </td>

                                        <td>
                                            {getSymbol(guess.dri, answer.dri) + " " + guess.dri}

                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {getSymbol(guess.sho, answer.sho) + " " + guess.sho}
                                        </td>

                                        <td>
                                            {getSymbol(guess.def, answer.def) + " " + guess.def}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {getSymbol(guess.pas, answer.pas) + " " + guess.pas}
    
                                        </td>

                                        <td>
                                            {getSymbol(guess.phy, answer.phy) + " " + guess.phy}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </>
                })
            }
    </div>
}