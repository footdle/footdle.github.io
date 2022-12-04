import React from "react";
import { useState, useEffect, useRef} from "react";
import "./HLFCardRenderer.css"
import hlf_pool from "../hlf_pool.json"
import ClipLoader from "react-spinners/ClipLoader";

export default function HLFCardRenderer ({index, hidden, hideMode, loaded, setLoaded, smallMode=false}){

    const player = hlf_pool[index]
    let [color, setColor] = useState("#ffffff");

    const get_emoji = (mode)=>{
        if (mode == 1){
            // return an upwards arrow emoji
            return "⬆️"
        }
        else if (mode == 2){
            // return a downwards arrow emoji
            return "⬇️"
        }
        else if (mode == 3){
            // return an equal emoji
            return "="
        }
    }

    return (
        <>  
            <div className={"cardHolderHLF " + (hideMode == 2 ? 'darken ' : '') + (smallMode?'smallMode':'')} >
                <div className="topSideHLF">
                    <p className={'indicatorHLF ' + ((hideMode!=0) ? 'showing':'hidden') }>
                        {get_emoji(hideMode)}
                    </p>
                    {!loaded ? <ClipLoader color={color} loading={!loaded} size={'6vh'} /> : ''}
                    <img 
                        style = {loaded?{}:{'display':'none'}}
                        className={"playerFaceHLF"} src={"https://footdle.com/images/player_imgs/"+player['id']+".png"}
                        onLoad={() => {
                            setLoaded(true)
                            console.log('LOADED!!!!!!')
                        }}
                    />
                </div>

                <div className="botSideHLF" style={{width:"100%", marginTop:"0em", height:"31%",  display:'flex',justifyContent: 'center',
                                                        flexDirection: "column", alignItems: 'center' }}>
                    <table class={'tableHLF '+ (smallMode?'smallMode':'')} style={{marginTop:0}}>
                        <tr>
                            <td className={hidden == 'pace' ? "highlighted":""}>
                                {  (hideMode==0) && hidden == 'pace' ? "??" : player.pace} PAC
                            </td>

                            <td className={hidden == 'dribbling' ? "highlighted":""}>
                                {  (hideMode==0) &&  hidden == 'dribbling' ? "??" :player.dribbling} DRI

                            </td>
                        </tr>

                        <tr>
                            <td className={hidden == 'shooting' ? "highlighted":""}>
                                {  (hideMode==0) &&  hidden == 'shooting' ? "??" :player.shooting} SHO
                            </td>

                            <td className={hidden == 'defending' ? "highlighted":""}>
                                { (hideMode==0) &&  hidden == 'defending' ? "??" :player.defending} DEF
                            </td>
                        </tr>

                        <tr>
                            <td className={hidden == 'passing' ? "highlighted":""}>
                                { (hideMode==0) && hidden == 'passing' ? "??" :player.passing} PAS

                            </td>

                            <td className={hidden == 'physical' ? "highlighted":""}>
                                { (hideMode==0) && hidden == 'physical' ? "??" :player.physical} PHY
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </>
    )
}