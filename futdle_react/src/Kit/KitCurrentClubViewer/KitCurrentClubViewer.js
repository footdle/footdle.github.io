import React from "react";
import { useState, useEffect, useRef} from "react";
import './KitCurrentClubViewer.css';


export default function KitCurrentClubViewer ({selectedPlayer, submitPlayer, onclick, setPlayerMatches}) { 

    const getSelectedYear = () => {
        let a = document.getElementById("selectedYear").value
        return a
    }

    const [yearMode, setYearMode] = useState(false)
    const [selectedYear, setSelectedYear] = useState(22)
    const [yearConfirmed, setYearConfirmed] = useState(false)

    
    return (
        <>
        {selectedPlayer != null ? 
        
        <div 
        onClick={(e) =>{
            if(onclick != undefined){
                onclick(selectedPlayer)
                setPlayerMatches([])
            }
        }}
        className={`current_row ${submitPlayer != undefined ? 'need_bg' : ""}`}> 

        {!yearMode ?
            typeof selectedPlayer == "string" ?
                <span>{selectedPlayer}</span>:
                (typeof selectedPlayer == "object" ?
                    <div className="currentPlayerView">
                            <span className="iteminrow"> {selectedPlayer['club']} -- {selectedPlayer['year']}</span>
                            {submitPlayer != undefined ?
                            
                                <span className="iteminrow"> 
                                    <input id="selectedYear" type="number" min={17} max={22} defaultValue={22}/>
                                </span>
                            : ''
                        }
                        
                    
                    </div>:
                "")
            
        : (!yearConfirmed ? 
            <div style={{display:"flex", flexDirection:"row"}}>
                <button onClick={ ()=>{
                        setSelectedYear(17)
                        setYearConfirmed(true)
                    }}>
                    17
                </button>

                <button onClick={ ()=>{
                        setSelectedYear(18)
                        setYearConfirmed(true)
                    }}>
                    18
                </button>

                <button onClick={ ()=>{
                        setSelectedYear(19)
                        setYearConfirmed(true)
                    }}>
                    19
                </button>

                <button onClick={ ()=>{
                        setSelectedYear(20)
                        setYearConfirmed(true)
                    }}>
                    20
                </button>

                <button onClick={ ()=>{
                        setSelectedYear(21)
                        setYearConfirmed(true)
                    }}>
                    21
                </button>

                <button onClick={ ()=>{
                        setSelectedYear(22)
                        setYearConfirmed(true)
                    }}>
                    22
                </button>
                
                </div>
            :
                <div style={{display:"flex", flexDirection:"row"}}>
                    <button onClick={() =>{
                        setYearConfirmed(false)
                    }}> {"<-"}</button>
                    <span>{selectedPlayer}</span>
                    --
                    <span>{selectedYear}</span>
                </div>
            )
        }

            {submitPlayer != undefined ? <button className="submitButton" onClick={(e) => {
                    if(yearConfirmed && yearMode){
                        console.log("Submitting Player")
                        submitPlayer(selectedPlayer, selectedYear)   
                    } else {
                        console.log("Setting year mode")
                        setYearMode(true)
                    }
                }
                
                }
                disabled={!yearConfirmed && yearMode}
                
                >
                {yearMode ? "Make Guess" :"Set Year" }
            </button> : "" }
            
             </div>
         : "" }
       
        </>
    )
}