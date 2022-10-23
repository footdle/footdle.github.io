import React from "react";
import "./KitClashRenderer.css"

export default function KitClashRenderer ({answer, guessCount}) {

    const blurs = [
        40,
        10,
        5,
        1,
        0
    ]

    return     'kit_url' in answer ? <div>
        <div>
            <img style={{width:"35vh", height:"35vh", filter: "blur("+blurs[guessCount]+"px)"}} src={"kit_dir/"+answer['kit_url']}/>
        </div>
    </div> : <></>
}