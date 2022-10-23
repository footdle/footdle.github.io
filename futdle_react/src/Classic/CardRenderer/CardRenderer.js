import React from "react";
import { useState, useEffect, useRef} from "react";
import "./CardRenderer.css"




export default function CardRenderer ({guess}) { 

    return (
        <>  
            <div style={{display:'flex', alignItems:'center'}}>
                <span style={{display:'flex'}}>League:
                { guess['league'] != '??' ? <img className="leftSideIconPic" src={process.env.PUBLIC_URL + guess['league']} /> : "??"}
                </span>

            </div>
            <div className="cardHolderGold">
                    <div className="topSide">
                        <div className="leftSide">
                            <span>
                                {guess['pos']}
                            </span>

                            <span>
                            { guess['club_id'] != '??' ? <img className="leftSideIconPic" src={"https://footdle.com/images/club_imgs/"+guess['club_id']+".png"}  /> : "??"}
                            </span>
                                
                            <span>

                            { guess['country_code'] != '??' ? <img className="leftSideIconPic" src={"https://footdle.com/images/nat_imgs/"+guess['country_code']+".png"} width="16" height="12" alt="SA"/> : "??"}
                            {/* {guess['nat']} */}
                            </span>

                        </div>
                        <div className="rightSide">
                            <img className = "cardPic" referrerPolicy="no-referrer" src={"https://footdle.com/images/player_imgs/"+guess['img_id']+".png"} >

                            </img>
                            
                        </div>
                    </div>

                    <div className="botSide">
                        <span>
                            {guess['short_name']}
                        </span>
                    </div>
                    



            </div>
        </>
    )
}