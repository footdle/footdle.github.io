import React from "react";
import './HLF.css'
import {useState} from "react"
import HLFCardRenderer from "../HLFCardRenderer/HLFCardRenderer";
import hlf_pool from "../hlf_pool.json"
import PerfectScrollbar from 'react-perfect-scrollbar'
import withReactContent from 'sweetalert2-react-content'
import copy from 'copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';

// import useeffect
import {useEffect} from "react"

import Swal from 'sweetalert2/dist/sweetalert2.js'
import Random from 'java-random'


export default function HigherLowerFifaRenderer ({currentGameIsDaily, dailySeed, showMenu, resetGame}) { 
    const MySwal = withReactContent(Swal)
    const [hiding, setHiding] = useState('pace')

    const [leftPlayer, setLeftPlayer] = useState(0)
    const [rightPlayer, setRightPlayer] = useState(1)

    const attribs = ['pace', 'shooting', 'dribbling', 'passing', 'defending', 'physical']

    const [message, setMessage] = useState("")
    const [hideMode , setHideMode] = useState(true)
    const [leftHideMode, setLeftHideMode] = useState(0)
    const [rightHideMode, setRightHideMode] = useState(0)
    const [streak, setStreak] = useState(0)
    const [leftChange, setLeftChange] = useState(true)
    const [rightChange, setRightChange] = useState(true)

    const rng = new Random()
    const [randFunc, setRandFunc] = useState(true)
    const [initialSet, setInitialSet] = useState(false)

    useEffect (()=>{

        //console.log('Current game is daily: ', currentGameIsDaily)
        if (currentGameIsDaily){
            //console.log('because current game is daily is true, using daily ', dailySeed())
            rng.setSeed(dailySeed() * 1000)
        }
        else{
            var  random_Seed = Math.random()
            //console.log('because current game is daily is false, using random ', random_Seed)
            rng.setSeed(random_Seed* 100000)
        }

        setInitialSet(true)
        var rng_func = rng.doubles()
        setRandFunc(rng_func)

        const new_left = Math.floor(rng_func.next().value * hlf_pool.length)
        const new_right = Math.floor(rng_func.next().value* hlf_pool.length)
        const new_hiding = attribs[Math.floor(rng_func.next().value * attribs.length)]

        setLeftPlayer(new_left)
        setRightPlayer(new_right)
        setHiding(new_hiding)

    }, [currentGameIsDaily]);

    const randomise = () =>{
        const new_left = Math.floor(randFunc.next().value * hlf_pool.length)
        const new_right = Math.floor(randFunc.next().value* hlf_pool.length)
        const new_hiding = attribs[Math.floor(randFunc.next().value * attribs.length)]

        setLeftPlayer(new_left)
        setRightPlayer(new_right)
        setHiding(new_hiding)
    }


    let dayOfYear = function(){
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }
    
    const streakText = () =>{ 
        let st = "Footdle Higher or Lower FUT " +dayOfYear()+"\nStreak: " + streak + " ✅"
        return st
    }

    const shareText = (s) => {
        copy(s)
        toast.info('Copied result to the clipboard!', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    }

    const you_lose_menu = (lm_a, rm_a) =>{
        MySwal.fire({
            title: <p>You lose!</p>,
            position:'top',
            height:'65vh',
            width:'80vw',
            html: <div style={{    display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                height:'35vh',
                overflowY:'scroll',
                }}>
                <>
                    {currentGameIsDaily ? <button onClick={() => {shareText(streakText())}}>Share Result ✉️</button> : ''}
                    Your streak was: {streak}
                    <div style={{width:"100%", display:'flex', flexDirection:'row', justifyContent:'center'}}>
                        <HLFCardRenderer index={leftPlayer} loaded={leftChange} setLoaded={(function () {})} setLeftChange={(function () {})} hidden={hiding} hideMode={lm_a} smallMode={false}/>
                        <HLFCardRenderer index={rightPlayer} loaded={rightChange} setLoaded={(function () {})} setRightChange={(function () {})}  hidden={hiding} hideMode={rm_a} smallMode={false}/>
                    </div>

                </>
            </div>,
            
            cancelButtonText:'Back to Main Menu',
            cancelButtonColor:'red',
            // showConfirmButton:currentGameIsDaily,
            showConfirmButton:false,
            showCancelButton:true,
            allowOutsideClick:false,
            allowEscapeKey:false
        }).then((value) =>{
        
            if(value.isConfirmed){
            }else if(value.isDismissed){
                resetGame()
                showMenu()
            }
        })
    }

    const madeGuess = (guessed_left_higher) => {

        const left_attr = hlf_pool[leftPlayer][hiding]
        const right_attr = hlf_pool[rightPlayer][hiding]

        var lm = 0
        var rm = 0

        var lost = false;
        if ((guessed_left_higher && left_attr > right_attr) || (!guessed_left_higher && left_attr < right_attr)){
            setMessage("Correct!")
            // set the left and right hide mode accordingly if they are the lower value
            if (left_attr < right_attr){
                setLeftHideMode(2)
                setRightHideMode(1)
            } else {
                setLeftHideMode(1)
                setRightHideMode(2)
            }
            setHideMode(false)
            setStreak(streak+1)
        } else if (left_attr == right_attr){
            setMessage("Drawn...")
            setHideMode(false)
            setLeftHideMode(3)
            setRightHideMode(3)
            setStreak(streak+1)
             // set the left and right hide mode accordingly if they are the lower value

        }else{
            setMessage("Wrong...")
            lost = true;
            setHideMode(false)
            if (left_attr < right_attr){
                setLeftHideMode(2)
                setRightHideMode(1)

                lm = 2
                rm = 1
            } else {
                setLeftHideMode(1)
                setRightHideMode(2)

                lm = 1
                rm = 2

            }


            // showMenu()
        }

        // after 5 seconds reset the hiding
        setTimeout(() => {
            if(!lost){
                randomise()
                // //console.log(new_hiding)
                setMessage("")
                setLeftHideMode(0)
                setRightHideMode(0)
                setHideMode(true)

                
                setLeftChange(false)
                setRightChange(false)

            }else{
                you_lose_menu(lm, rm)
            }
        }, 2500);
        


    }

    return (
        <>  
        <div className="hlf_thign">

            <center>
                Who has the higher <span style={{color:'#854f01'}}>{hiding}</span> ? <br/>
                Current Streak: {streak}
                {/* , <span class="player_name">{hlf_pool[leftPlayer]['short_name']}</span> or <span class="player_name">{hlf_pool[rightPlayer]['short_name']}</span> ? */}
                </center>

            <div style={{display:'flex', flexDirection:'row', justifyContent: 'center'}}>
                <HLFCardRenderer index={leftPlayer} hidden={hiding} hideMode={leftHideMode} loaded={leftChange} setLoaded={setLeftChange}/>
                <HLFCardRenderer index={rightPlayer} hidden={hiding} hideMode={rightHideMode} loaded={rightChange} setLoaded={setRightChange}/>
            </div>
            <div style={{display:'flex', flexDirection:'row', widt:"100%", justifyContent:'space-around'}}>
                <button className={"nameButtonHLF"} onClick={() => {
                        madeGuess(true)
                        //console.log('slc')
                    }}>
                    {hlf_pool[leftPlayer]['short_name']}
                </button>

                <button  className={"nameButtonHLF"}  onClick={() => {
                        madeGuess(false)
                        //console.log('src')
                    }}>
                    {hlf_pool[rightPlayer]['short_name']}
                </button>
            </div>
        </div>
        </>
    )
}