import React from "react";
import { useState, useEffect, useRef} from "react";
import good_ones from "../guess_who_data/good_ones_2.json"
import played_with from "../guess_who_data/played_with.json"
import player_info from "../guess_who_data/player_information.json"

import "./GuessWho.css"

import GuessWhoPlayerRenderer from "../GuessWhoPlayerRenderer/GuessWhoPlayerRenderer";

export default function GuessWhoRenderer ({guess_answer, guess_count, guess_matrix, hint_count }) {

    const showNationalityGuess = (hint_count) => hint_count >= 1
    const showPositionGuess = (hint_count) => hint_count >= 2

    const did_he_play_with = (player, answer) => {
        try {
            let teams_that_played_with_player = played_with[player['player_id']]
            let teams_that_played_with_answer = played_with[guess_answer['player_info']['player_id']]
            let teams_player = Object.keys(teams_that_played_with_player)
            let teams_answer = Object.keys(teams_that_played_with_answer)

            let teams_to_check = teams_player.filter(team => teams_answer.includes(team))


            let return_obj = []

            for (let i  = 0; i < teams_to_check.length; i ++){
                let team = teams_to_check[i]
                for(let j = 0; j < teams_that_played_with_player[team].length; j ++){
                    let p = teams_that_played_with_player[team][j]
                    if(p[0] == answer['player_info']['player_id']){
                        return_obj.push(team)
                    }
                }
            }


            return return_obj.length > 0
        } catch (error) {
            return false
        }
        
    }

    return     <div className='guess_who_outer'>
        <div style={{margin: "0 0 1vh 0"}}>
           <center>Which player has played with all of the following players? <br></br></center>
        </div>

        <div className='guess_who_clue_holder'>
            {guess_answer['list_of_team_mates'].map((player, index) => {
                    return <>
                    <GuessWhoPlayerRenderer key={index} player={player} show_club={true} hidden={false}/>
                    </>
                })
            }
        </div>
        <div className='hints_row' style={{marginTop: "10px"}}>
            <div>
                {showNationalityGuess(hint_count) || showPositionGuess(hint_count) ?  "Hints:" : ""}
            </div>
            <div className={"guess_who_hint " + (showNationalityGuess(hint_count) ? "" : "hidden")}>
                <div>
                    <span className="hint_title">Player Nationality</span>
                </div>
                <div>
                    {'country' in guess_answer['player_info'] ? guess_answer['player_info']['country']: ""}
                </div>
            </div>

            <div className={"guess_who_hint " + (showPositionGuess(hint_count)  ? "" : "hidden")}>
                    <span className="hint_title">Player Position</span>
                    <div>
                    {guess_answer['player_info']['position']}
                </div>
            </div>
        </div>

        <hr style ={{backgroundColor:"white"}}></hr>

        <center style={{color:"#fff900"}}>Guesses made so far ({guess_count()}/8)</center>
        <div className={"guess_who_guess_matrix"}>
                <table className="guess_who_table">
                <tr style={{color:'yellow'}}>
                    <td className="guess_who_guess_matrix_row_left">

                    </td>
                    <td>
                        Player
                    </td>
                    <td>
                        Played With ?
                    </td>
                </tr>

                {
                    hint_count > 0 ?
                    <tr>
                        <td className="guess_who_guess_matrix_row_left">
                        </td>
                        <td className="guess_who_guess_matrix_row_right">
                            Used a hint x {hint_count}
                        </td>
                        <td className="guess_who_guess_matrix_row_right">
                            Used a hint x {hint_count}
                        </td>
                    </tr>
                    :''
                }
                {guess_matrix.filter((item) => item != "empty_guess").map((item, index) => {
                        return <tr className={"guess_who_guess_matrix_row"}>
                            <td className="guess_who_guess_matrix_row_left">
                                {<img className={"guess_who_guess_matrix_img"} src={item['img_url']} />}
                            </td>
                            <td className="guess_who_guess_matrix_row_right">
                                {item['short_name']}
                            </td>
                            <td className="guess_who_guess_matrix_row_right">
                                {did_he_play_with(item, guess_answer) ? "✅" : "❌"}
                            </td>
                        </tr>
                    })
                        
                }

                </table>
                
        </div>
    </div>
}
