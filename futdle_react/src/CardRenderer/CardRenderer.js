import React from "react";
import { useState, useEffect, useRef} from "react";
import "./CardRenderer.css"




export default function CardRenderer ({guess}) { 

    return (
        <>  
            <div style={{display:'flex', alignItems:'center'}}>
                <span style={{display:'flex'}}>League:
                { guess['lig_url'] != '??' ? <img className="leftSideIconPic" src={process.env.PUBLIC_URL + guess['lig_url']} /> : "??"}
                </span>

            </div>
            <div className="cardHolderGold">
                    <div className="topSide">
                        <div className="leftSide">
                            <span>
                                {guess['pos']}
                            </span>

                            <span>
                            { guess['tim_url'] != '??' ? <img className="leftSideIconPic" src={guess['tim_url']}  /> : "??"}
                            </span>
                                
                            <span>

                            { guess['nat'] != '??' ? <img className="leftSideIconPic" src={`https://flagcdn.com/w80/${guess['nat'].toLowerCase()}.png`} width="16" height="12" alt="SA"/> : "??"}
                            {/* {guess['nat']} */}
                            </span>

                        </div>
                        <div className="rightSide">
                            <img className = "cardPic" referrerPolicy="no-referrer" src={guess['img']}>

                            </img>
                            
                        </div>
                    </div>

                    <div className="botSide">
                        <span>
                            {guess['nam']}
                        </span>
                    </div>
                    



            </div>
        </>
    )
}