import React from "react";
import { useState, useEffect, useRef} from "react";
import './KitSearchBar.css';
import KitCurrentClubViewer from "../KitCurrentClubViewer/KitCurrentClubViewer";

export default function IconSearchBar ({names, clearField, setSelectedClub, updateClearField}) { 
    const search_text_ref = useRef()
    const [search_text, setSearchText] = useState(search_text_ref.current);
    const [matches, setkitMatches] = useState([])

    useEffect( () =>{
        search_text_ref.current.value = null
        updateClearField(false)
    }, [clearField])

    const updateSearchRef = (e) => {
        let text = search_text_ref.current.value.toLowerCase().trim()

        if(text == "") {
            setkitMatches([])
            return []
        }

        let temp = []
        for(let i = 0; i < names.length; i ++){
            try {
                let kit = names[i]
                // console.log("checking from " + kit['club'])
                let converted_name = kit.normalize("NFD").replace(/\p{Diacritic}/gu, "")
                if(converted_name.toLowerCase().includes(text.toLowerCase()) ){
                    temp.push(kit)
                }
            } catch (error) {
                // console.log(error)
                console.log("ERROR", names[i], error)
            }
        }

        setkitMatches(temp)
        setSelectedClub(null)

    }
    return (
        <>
        <input
        className="kitInput"
        // disabled={!gameActive}

        ref={search_text_ref}
        onChange={updateSearchRef}
        placeholder="Club Name"
        type="text"

        />
        
        { matches.length > 0 ? 
            <div className="results">
                {matches.slice(0, 10).map((item, k) => {
                    return <div >
                        <p onClick={() => {
                            setSelectedClub(item)
                            setkitMatches([])
                            }}>
                            {item}
                        </p>
                        {/* <KitCurrentClubViewer selectedPlayer={item} submitPlayer={undefined} onclick={setSelectedClub} 
                                        setPlayerMatches={setkitMatches}/> */}
                    </div>
                } 
                    
                ) 
            }

            </div> 
            : ""
        }
        </>
    )
}