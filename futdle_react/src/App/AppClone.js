import { useTimer } from 'react-timer-hook';

import logo from '../logo.svg';
import './App.css';
import players from '../answers_temp.json';
import other_players from '../players_temp.json';
import SearchBar from '../Classic/SearchBar/SearchBar';
import CurrentPlayerViewer from '../Classic/CurrentPlayerView/CurrentPlayerViewer';
import GuessMatrix from '../Classic/GuessMatrix/GuessMatrix';
import OpponentMatrix from '../Classic/GuessMatrix/OpponentMatrix';
import { useState, useEffect, useRef} from "react";
import CardRenderer from '../Classic/CardRenderer/CardRenderer';
import copy from 'copy-to-clipboard';
import random from "random-seed"
import {Helmet} from "react-helmet";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2/dist/sweetalert2.js'

import '@sweetalert2/theme-dark/dark.css'
import withReactContent from 'sweetalert2-react-content'

import ReactGA from 'react-ga';

import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

import { doc, onSnapshot } from "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


function App() {

  const componentRef = useRef({});
  const { current: my } = componentRef;

  const firebaseConfig = {
    apiKey: "AIzaSyDDfJn93cw_Zh4RYJZS2Ldldr2phGbRKhg",
    authDomain: "footdle.firebaseapp.com",
    projectId: "footdle",
    storageBucket: "footdle.appspot.com",
    messagingSenderId: "759582982923",
    appId: "1:759582982923:web:730c10f890e75ba2c5580e",
    measurementId: "G-3V6DNML8PB"
  };

  const this_id = Math.floor(Math.random()*1000)

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);


  useEffect(() => {

    

    // Footdle.github.io
    ReactGA.initialize('UA-159262483-2');

    // Footdle.com  
    // ReactGA.initialize('UA-159262483-3');
    ReactGA.pageview(window.location.pathname);
  }, [])

  const MySwal = withReactContent(Swal)

  let dayOfYear = function(){
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  let getTodayRandom = function(){
    
    return random.create(dayOfYear() + (new Date().getFullYear())).random()
  }

  const showAd = () => {
    const scriptTag = document.createElement("script");
    // footdle.github
    scriptTag.src = "//upgulpinon.com/1?z=4912989";
    // footdle.com
    // scriptTag.src = "//upgulpinon.com/1?z=4919531";
    scriptTag.async = true;
    scriptTag.setAttribute("data-cfasync", "false")
    document.body.appendChild(scriptTag);
  }

  const [selectedPlayer, setSelectedPlayer] = useState(undefined)
  const [guesses, updateGuesses] = useState([])
  const [clearField, updateClearField] = useState(false)
  const [answer, setAnswer] = useState({})
  const [currentGuess, setCurrentGuess] = useState({"pos":"??","lig":"??","lig_url":"??", "tim":"??","nat":"??","nam_long":"??", "nam":"??", "img": "https://cdn.sofifa.com/players/230/481/22_60.png", "tim_url":"??"})
  const [shareMatrix, setShareMatrix] = useState("")
  const [needsShare, setNeedsShare] = useState(false)
  const [gameActive, setGameActive] = useState(true)
  const [currentGameIsDaily, setCurrentGameIsDaily] = useState(false)
  const [waitingForPlayer2, setWaitingForPlayer2] = useState(true)
  const [waitingSwal, setWaitingSwal] = useState(undefined)

  const [needsOpponentGrid, setNeedsOpponentGrid] = useState(false)
  const [opponentLatest, setOpponentLatest] = useState([0,0,0,0,0])
  const [opponentGuessCount, setOpponentGuessCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp: new Date().getSeconds(), autoStart:false, onExpire: () => console.log('onExpire called fo nemm ' + new Date()) });

  const limit = 12



  const resetGame = () => {
    //console.log("game reset.")
    setGameActive(true)
    setSelectedPlayer(undefined)
    updateGuesses([])
    setNeedsOpponentGrid(false)
    setOpponentLatest([])
    setOpponentGuessCount(0)
    setCurrentGuess({"pos":"??","lig":"??","lig_url":"??", "tim":"??","nat":"??", "nam_long":"??", "nam":"??", "img": "https://cdn.sofifa.com/players/230/481/22_60.png", "tim_url":"??"})

    let l = Math.floor(Math.random() * players.length);
    setAnswer(players[l])

  }
  
  useEffect(() =>{
  }, [selectedPlayer])
  
  const matching = (guess, answer) =>{

    if (typeof answer === 'undefined' || typeof guess === 'undefined') return false
    let m = true;

    let keys = Object.keys(answer)
    for(let i = 0; i < keys.length; i ++){
      if(answer[keys[i]] != guess[keys[i]]){
        return false
      }
    }
    
    return true
  }



  useEffect(() => {

    let guess = guesses[guesses.length-1]
    
    if(!needsOpponentGrid){
        if(guesses.length >= limit && guess != answer){
            setGameActive(false)
      
            MySwal.fire({
              title: <p>You lose.</p>,
              html: <div style={{    display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'}}>
                  <CardRenderer guess={my.answer}/>
                </div>,
              
              confirmButtonText:'Share Result',
              cancelButtonText:'Try Another Random Player',
              showConfirmButton: currentGameIsDaily,
              showCancelButton:true,
              allowOutsideClick:false,
              allowEscapeKey:false
            }).then((value) =>{
      
              if(value.isConfirmed){
                let s = shareText(false)
      
                copy(s)
                
                
                
              }else if(value.isDismissed){
      
                // Reset the game
                setCurrentGameIsDaily(false)
                //console.log("game has been reset 1")
                resetGame()
              }
        
            })
          }

          if(matching(guess,answer)){
            setGameActive(false)
            MySwal.fire({
              title: <p>Correct Guess! {currentGameIsDaily}</p>,
              html: <div style={{    display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'}}>
                  <CardRenderer guess={currentGuess}/>
                  <span>{guesses.length}/{limit} attempts made</span>
      
                </div>,
              
              confirmButtonText:'Share Result',
              cancelButtonText:'Try Another Random Player',
              showCancelButton:true,
              showConfirmButton:currentGameIsDaily,
              allowOutsideClick:false,
              allowEscapeKey:false
            }).then((value)=>{
              
              const scriptTag = document.createElement("script");
              scriptTag.src = "//upgulpinon.com/1?z=4912989";
              scriptTag.async = true;
              scriptTag.setAttribute("data-cfasync", "false")
              document.body.appendChild(scriptTag);
      
              if(value.isConfirmed){
                let s = shareText(true)
                copy(s)
                MySwal.fire({
                  toast:true,
                  timer:3000,
                  text:"Copied result to Clipboard!"      
                })
                
              }else if(value.isDismissed){
      
                // Reset the game
                setCurrentGameIsDaily(false)
                //console.log("game has been reset 2")

                resetGame()
              }
        
              
            })
          }
    }else if(needsOpponentGrid){
        if(matching(guess,answer)){
            setGameActive(false)
            my.did_guess_it = true

            // check if the opponent has also guessed it
            console.log(my.opp_grid, JSON.stringify(guesses))
            if(my.opp_grid [0] == 2 && my.opp_grid[1] < guesses.length){
                MySwal.fire({
                    title: <p>Correct Guess! {currentGameIsDaily}</p>,
                    html: <div style={{    display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'}}>
                        <CardRenderer guess={currentGuess}/>
                    
                      <p>You guessed it in {guesses.length} attempts! Your opponent guessed the answer before you, but it took them {my.opp_grid[1]} attempts, so you still win!</p>
                      </div>,
                    
                    confirmButtonText:'Share Result',
                    cancelButtonText:'Try Another Random Player',
                    showCancelButton:true,
                    showConfirmButton:currentGameIsDaily,
                    allowOutsideClick:false,
                    allowEscapeKey:false
                  }).then((value)=>{
                    
                    if(value.isConfirmed){
                      let s = shareText(true)
                      copy(s)
            
                      toast.info('Copied result to the clipboard!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                      });
                     
                      
                    }else if(value.isDismissed){
            
                      // Reset the game
                      setCurrentGameIsDaily(false)
                //console.log("game has been reset 3")

                      resetGame()
                    }
              
                    
                  })
            }else if(my.opp_grid[0] == 2 && my.opp_grid[1] == my.guesses.length){
                MySwal.fire({
                    title: <p>You Lose! {currentGameIsDaily}</p>,
                    html: <div style={{    display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'}}>
                        <CardRenderer guess={currentGuess}/>
                    
                      <p>You and you opponent both guessed it in {guesses.length} attempts! However, you took longer! So you lose.</p>
                      </div>,
                    
                    confirmButtonText:'Share Result',
                    cancelButtonText:'Try Another Random Player',
                    showCancelButton:true,
                    showConfirmButton:currentGameIsDaily,
                    allowOutsideClick:false,
                    allowEscapeKey:false
                  }).then((value)=>{
                    
                    if(value.isConfirmed){
                      let s = shareText(true)
                      copy(s)
            
                      toast.info('Copied result to the clipboard!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                      });
                     
                      
                    }else if(value.isDismissed){
            
                      // Reset the game
                      setCurrentGameIsDaily(false)
                //console.log("game has been reset 4")

                      resetGame()
                    }
              
                    
                  })
            }else if(my.opp_grid[0] != 2 && my.opp_grid[4] < guesses.length-1){
                // toast("")
                const d = new Date()
                //console.log("before  "+d)
                d.setSeconds(d.getSeconds() + 5)

                //console.log("after  "+d)
                
                restart(d)
                // start()
                //console.log(minutes)
                //console.log("alhamdulillah")

                let timerInterval

                MySwal.fire({
                  title: <p>You are Winning! </p>,
                  timer:121*1000,
                  timerProgressBar:true,
                  html: <div style={{    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'}}>
                      <CardRenderer guess={answer}/>
                  
                    <p>Your opponent has <b></b> to try to guess it in  {(guesses.length-1)} guesses, otherwise, you win!</p>
                    </div>,

                  didOpen: () =>{
                    Swal.showLoading()
                    const b = Swal.getHtmlContainer().querySelector('b')
                    timerInterval = setInterval(() => {
                      b.textContent = timeAsString(Swal.getTimerLeft()/1000)
                    }, 100)
                  },

                  willClose: () => {
                    clearInterval(timerInterval)
                  },
                  
                  confirmButtonText:false,
                  showCancelButton:false,
                  cancelButtonText:timeAsString(minutes*60 + seconds),
                  showConfirmButton:true,
                  allowOutsideClick:false,
                  allowEscapeKey:false
                }).then((value)=>{

                  if(value.isConfirmed){
                    // Reset the game
                    setCurrentGameIsDaily(false)
                    //console.log("game has been reset 5")
  
                    resetGame()
                    startGame()
              

                  }
                  
                  
                })

            }else if(my.opp_grid[0] != 2 && (my.opp_grid[4] >= guesses.length-1)){
              // toast("")
              MySwal.fire({
                title: <p>YOU WIN!</p>,
                html: <div style={{    display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'}}>
                  <CardRenderer guess={answer}/>
                  <span> Opponent didn't guess it!</span>
      
                </div>,
                
                cancelButtonText:'Rematch',
                showConfirmButton: true,
                confirmButtonText:"OK",
                allowOutsideClick:false,
                allowEscapeKey:false
              }).then((value) =>{
        
                  // Reset the game
                  setCurrentGameIsDaily(false)
                  //console.log("game has been reset 7")
  
                  resetGame()
                  startGame()
          
              })
            }

            
        }else{
            // Doesn't match, let's check if opponent won
            if(my.opp_grid[0] == 2 && guesses.length >= (my.opp_grid[1]-1)){
              pause()

                MySwal.fire({
                    title: <p>You Lose! </p>,
                    html: <div style={{    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'}}>
                      <CardRenderer guess={answer}/>
                      <p>Your opponent guessed it in {my.opp_grid[1]} attempts!</p>
                      </div>,
                    
                    confirmButtonText:'Back To Main Menu',
                    showCancelButton:false,
                    showConfirmButton:true,
                    allowOutsideClick:false,
                    allowEscapeKey:false
                  }).then((value)=>{
                    
                    // Reset the game
                    setCurrentGameIsDaily(false)
                //console.log("game has been reset 6")

                    resetGame()
                    startGame()
              
                    
                  })
            }
        }
    }
    

  }, [guesses])

  useEffect(() =>{

    


    <Helmet>
      {/* Footdle.github.io */}
      {/* <meta name="propeller" content="76e70fd611122a7004438cc2477e50fb"/> */}
      
      {/* Footdle.com */}
      {/* <meta name="propeller" content="a253337b724e85d093ee17ea169bceea"/> */}
    </Helmet>
    document.title = "Footdle"

    
  setNeedsOpponentGrid(false)

  MySwal.fire({
    showCancelButton: true,
    confirmButtonText:"Ok!",
    allowEscapeKey:false,
    title:"Update!",
    html:  <>
    <div style={{overflowY:'auto', fontSize:'small',  fontWeight:50}}>
      <p>1. Updated the database with the latest transfers!</p>
      <p> <a href="https://donate.unhcr.org/int/en/ukraine-emergency?gclid=Cj0KCQiA95aRBhCsARIsAC2xvfxJfXIVIYbjYglyykGKYkjFsfetU7UqG44ysm5Yh4L2baQZZ77Sc1kaAk6oEALw_wcB&gclsrc=aw.ds" > Kindly consider donating to Ukrainians in need </a></p>

      <p>Now you will see a single advertisment. Thanks for the patience</p>
      <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>
    </div>
    </>,
    showCancelButton: false,
    allowOutsideClick: false,
    
  }).then((value)=>{
    showAd()

    startGame()
  })
    

}, [])


const startGame = () => {
    let tutorial_guesses = [{'img': "https://cdn.sofifa.net/players/210/413/22_120.png",
    'key': "210413",
    'lig': "Italian Serie A",
    'lig_flg': "https://cdn.sofifa.net/flags/it.png",
    'lig_url': 'LeagueIcons/sa.png',
    'nam': "a. romagnoli",
    'nat': "IT",
    'pos': "CB",
    'tim': "AC Milan",
    'tim_url': "https://cdn.sofifa.net/teams/47/60.png"},
  
    {
      "key": "216393",
      "pos": "CM",
      "nat": "BE",
      'lig_url':'LeagueIcons/epl.png',
      "lig": "English Premier League",
      "tim": "Leicester City",
      "tim_url": "https://cdn.sofifa.net/teams/95/60.png",
      "nam": "y. tielemans",
      "img": "https://cdn.sofifa.net/players/216/393/22_120.png",
      "lig_flg": "https://cdn.sofifa.net/flags/gb-eng.png"
  }]

    let tutorial_answer = {
      "key": "192985",
      "pos": "CM",
      "nat": "BE",
      "lig": "English Premier League",
      "tim": "Manchester City",
      "tim_url": "https://cdn.sofifa.net/teams/10/60.png",
      "nam": "k. de bruyne",
      "img": "https://cdn.sofifa.net/players/192/985/22_120.png",
      "lig_flg": "https://cdn.sofifa.net/flags/gb-eng.png"
  }

    MySwal.fire({
        showCancelButton: true,
        confirmButtonText:"Today's Challenge",
        allowEscapeKey:false,
        html:  <>
        <div style={{overflowY:'auto', fontSize:'small', height:'60vh', fontWeight:50}}>
          {minutes} - {seconds}
          <p>A random player has been chosen from the top 300 rated players from the Top 5 Leagues on Fifa 22. The aim is to guess which player it is within {limit} attempts, by using players themselves as guesses.</p>
          <hr></hr>
          <p>Consider the case where our guess is Romagnoli. In this case, since all the fields are red, we know that the player is not a center back, he does not play in Seria A, and he is not Italian.</p>
          <div className='holder'>
            <GuessMatrix guesses = {[tutorial_guesses[0]]} answer={tutorial_answer} />
          </div>
          <hr></hr>
          <p>In this next case we have guessed Youri Tielemans. Since some fields are green, we know that the player is a Belgian CM who plays in the EPL, however, not for Leicester City.</p>
          <div className='holder'>
            <GuessMatrix guesses = {[tutorial_guesses[1]]} answer={tutorial_answer} />
          </div>
  
          <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>
        </div>
        </>,
        cancelButtonText: "Random Challenge",
        denyButtonText: "Versus Mode",
        showDenyButton:true,
        allowOutsideClick: false,
        
      }).then((value)=>{
  
        let random_gen_func = null;
        if(value.isConfirmed){
          random_gen_func = getTodayRandom
          setCurrentGameIsDaily(true)
        }else if(value.isDismissed){
          random_gen_func = Math.random
        }else if(value.isDenied){
          versusMode()
        }
  
        let l = Math.floor(random_gen_func() * players.length);
        setAnswer(players[l])
  
    })
}

  const getID = async () => {

    //console.log("Adding with ", this_id)
    

    try {
      //console.log("adding time", new Date().getTime())
      const docRef = await addDoc(collection(db, "rooms"), {
        
        "player1": [0,0,0,0,0],
        "player2": [0,0,0,0,0],
        "player2_joined": false,
        "seed": Math.floor(Math.random()*players.length),
        "time":new Date().toUTCString()
      });
      //console.log("Document written with ID: ", docRef.id);
      return docRef.id
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const timeAsString = (time) =>
  {
    let mins = Math.floor(time / 60)
    let seconds = Math.floor(time-mins*60)

    let mins_part = mins > 0 ? 
        mins + " minute"+(
            mins == 1 ? "":"s"
        ) : ""

    let seconds_part = seconds +" second"+ (
        seconds == 1 ? "" : "s"
    )
    return mins_part + " " + seconds_part
  }

  const arrays_match = (a1, a2) => {
      if (a1.length  != a2.length) return false
      
      for(let i = 0; i < a1.length; i ++){
          //console.log(a1[i], a2[i])
          if(a1[i] != a2[i]) return false
      }

      return true
  }

  const handle_game_update = (game_state, answer) => {

    const opp_grid = game_state[my.other_player]
    //console.log("game update", JSON.stringify(answer))

    
    if(!arrays_match(opp_grid, my.opp_grid)){
        // Opponent made a change
        setOpponentLatest(opp_grid)
        //console.log("Opp grid", opp_grid)
        my.opp_grid = opp_grid

        if(opp_grid[0] == 2){
            setOpponentGuessCount(opp_grid[1])
            console.log("opp grid,", opp_grid[1], my.guesses, "guesses", guesses.length+1)
            //console.log("Hello ", opp_grid[0], "asdasd", opp_grid[1], typeof(opp_grid[1]))
            if(opp_grid[1] > (my.guesses.length+1)){
                toast.info('Opponent guessed it in ' + opp_grid[1] + ' tries. You have 2 minutes to try to get it in ' + (opp_grid[1] -1) + ' attempts or less!' , {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });

                my.decrements = 50
                const d = new Date()
                //console.log("before  "+d)
                d.setSeconds(d.getSeconds() + 5)

                //console.log("after  "+d)
                
                restart(d)
                // start()
                //console.log(seconds)
                //console.log("alhamdulillah")
                
                
                // my.timeout = setInterval(() => {
                //     //console.log("decrement")

                //     if(my.timeLeft <= 0){
                //         MySwal.fire({
                //             "title": " YOU LOSE"
                //         })

                //         clearInterval(my.timeout)
                //     }
                //     my.timeLeft = my.timeLeft-my.decrements/1000
                //     setTimeLeft(my.timeLeft)
                // }, my.decrements)
            }else{
                //console.log(answer, guesses)
                pause()

                MySwal.fire({
                    title: <p>You lose.</p>,
                    html: <div style={{    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'}}>
                      <CardRenderer guess={my.answer}/>
                      <span> Opponent guessed it in {opp_grid[1]} attempts, you guessed it in {my.guesses.length} attempts!</span>
          
                    </div>,
                    
                    cancelButtonText:'Rematch',
                    showConfirmButton: true,
                    confirmButtonText:"OK",
                    allowOutsideClick:false,
                    allowEscapeKey:false
                  }).then((value) =>{
            
                      // Reset the game
                      setCurrentGameIsDaily(false)
                      //console.log("game has been reset 7")

                      resetGame()
                      startGame()
              
                  })
            }
        }else{
          if(my.did_guess_it && my.guesses.length-1 <= my.opp_grid.length){
            pause()
            MySwal.fire({
              title: <p>YOU WIN!</p>,
              html: <div style={{    display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'}}>
                <CardRenderer guess={my.answer}/>
                <span> Opponent didn't guess it!</span>
    
              </div>,
              
              cancelButtonText:'Rematch',
              showConfirmButton: true,
              confirmButtonText:"OK",
              allowOutsideClick:false,
              allowEscapeKey:false
            }).then((value) =>{
      
                // Reset the game
                setCurrentGameIsDaily(false)
                //console.log("game has been reset 7")

                resetGame()
                startGame()
        
            })
          }
        }
        setOpponentLatest(opp_grid)
    }

  }

  const game_started_2 = (game_id, answer) => {
    return new Promise(function(resolve, reject) {
      onSnapshot(doc(db, "rooms", game_id), (doc) => {
        //console.log("player 2...")

        if(doc.data()['game_started'] && !my.versus_started){
          my.versus_started = true
          my.guesses = []
          //console.log("Hooray! Game started")

          my.this_player = "player2"
          my.other_player = "player1"


          //console.log("This player", my.this_player)
          //console.log("Other player", my.other_player)

          //console.log("My ans", players[doc.data()['seed']])

          setNeedsOpponentGrid(true)
          my.opp_grid = [0,0,0,0,0]
          setAnswer( players[doc.data()['seed']])
          my.answer = players[doc.data()['seed']]

          resolve(true)
        }else if(doc.data()['game_started']){
          //console.log("Sending the following to game update", JSON.stringify(answer))
          handle_game_update(doc.data(), answer)
          //console.log("Versus started")
        }

      });
      
  })}

  const game_started_1 = (game_id, answer) => {
    return new Promise(function(resolve, reject) {
      onSnapshot(doc(db, "rooms", game_id), (doc) => {
        //console.log("player 1 lol.", my.versus_started)

        if(!my.versus_started && doc.data()['player2_joined'] != false){
          //console.log("Hooray! Game started")
          my.versus_started = true
          my.guesses = []


          
          my.this_player = "player1"
          my.other_player = "player2"


          //console.log("This player", my.this_player)
          //console.log("Other player", my.other_player)
          setNeedsOpponentGrid(true)
          my.opp_grid = [0,0,0,0,0]

          //console.log("My ans", players[doc.data()['seed']])
          setAnswer(players[doc.data()['seed']])
          my.answer = players[doc.data()['seed']]

          setWaitingForPlayer2(false)
          resolve(true)




          
        }else if(my.versus_started && doc.data()['player2_joined'] != false){
          //console.log("versus started")
          //console.log("Sending the following to game update", JSON.stringify(answer))

          handle_game_update(doc.data(), answer)

        }

      });
      
  })}

  const versusMode = async () => { 
    
    // Check if join or create game
    MySwal.fire({
      title:"Create or Join Game",
      html: <>
        <p> Press Create to create a new game session</p>
        <p> Press Join to join an existing game session</p>
      </>,

      showConfirmButton:true,
      confirmButtonText:"Create Game",
      cancelButtonText:"Join Game",
      denyButtonText:"Go Back",
      showDenyButton:true,
      showCancelButton:true
    }).then( async  (value) => {

      if(value.isConfirmed){
        // create game
        my.id = await getID()
        // my.id = "bananas"
        //console.log("I got the id!", my.id)

        MySwal.fire({
          showCancelButton: true,
          title:"Creating Game",
          allowEscapeKey:false,
          html:  <>
          <div style={{overflowY:'auto', fontSize:'small', fontWeight:50, display:"flex", flexDirection:"column", alignItems:"center"}}>
            Game code:
            Share this code with someone else to let them join the game:
            <p style ={{
              backgroundColor: "#2d2d2d",
              width: "fit-content",
              padding: "5px",
              fontFamily: "monospace",
              borderRadius: "5px"
          
            }}><span>{my.id}</span> <button onClick ={ () =>{
                copy(my.id)

                toast.info('Game ID copied to the clipboard', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
            }}>Copy ID</button></p>
            

          </div>
          </>,
          showDenyButton:false,
          showLoaderOnConfirm:"true",
          confirmButtonText:"Start Game",
          preConfirm: (uhh) =>{

            //console.log("part 1...")
            return game_started_1(my.id, answer).then((we) =>{
              //console.log("Ok .... wilstart")

              try {
                updateDoc(doc(db, "rooms", my.id ), {
                  game_started: true,
                }).then((a) =>{
                  //console.log("game started...")
                });
              } catch (e) {
                console.error("Error adding document: ", e);
              }
            })
          },
          showCancelButton:true,
          cancelButtonText:"Cancel",
          allowOutsideClick: false,
          
        }).then((value)=>{
            if(value.isDenied || value.isDismissed){
                try {
                deleteDoc(doc(db, "rooms", my.id )).then((a) =>{
                    //console.log("Deleted the document: ", my.id)
                    versusMode()
                });
                } catch (e) {
                console.error("Error adding document: ", e);
                }
            }
          

        })
      }else if(value.isDismissed){
        // join game
        //console.log("My id", this_id)
        MySwal.fire({
          showCancelButton: true,
          title:"Join Game",
          text:"Enter the game code to join",
          allowEscapeKey:false,
          input:"text",
          showLoaderOnConfirm: true,
          allowOutsideClick: false,
          allowEscapeKey: false,

          preConfirm: (uhh) =>{
            //console.log("ug", uhh)

            my.id = uhh
            updateDoc(doc(db, "rooms", uhh), {
              player2_joined:true,
            })

            

            
              
            return game_started_2(uhh, answer).then((we) =>{
              //console.log("Ok .... wilstart")
              
            })
          }
        }).then((value)=>{
            if(value.isDismissed){
                versusMode()
            }
          
          
          

        })
      }else if(value.isDenied){
          startGame()
      }

    })

    
  }

  const generateShareText = () => {

    let st = ''

    for (let i = 0; i < guesses.length; i ++){
      let player = guesses[i]
      let pos_ind = player.pos == answer.pos ? '🟩' : '🟥'
      let lig_ind = player.lig == answer.lig ? '🟩': '🟥'
      let nat_ind = player.nat == answer.nat ? '🟩' : '🟥'
      let tim_ind = player.tim == answer.tim  ? '🟩' : '🟥'

      st += pos_ind + lig_ind + nat_ind + tim_ind

      if(i < guesses.length-1){ st += "\n"}
    }

    return st
  }

  const shareText = (managed) =>{ 
    let m = managed ? guesses.length:'X'
    let st = "Footdle " + m +'/'+limit+'\n' + generateShareText()

    return st
  }

  const makeGuess = (guess) => {

    //console.log("against", JSON.stringify(answer))

    Object.entries(guess).map((a,i) =>{
      if(guess[a[0]] == answer[a[0]]) currentGuess[a[0]] = answer[a[0]]
    })
    console.log(needsOpponentGrid)
    if(needsOpponentGrid){
      my.guesses = [...guesses, guess]
      console.log("my gueses", JSON.stringify(my.guesses))
    } 


        //console.log('Guess count:', guesses.length + 1)

      if(needsOpponentGrid){
        const to_update = [
          currentGuess['pos'] == '??' ? 0 : 1,
          currentGuess['lig'] == '??' ? 0 : 1,
          currentGuess['nat'] == '??' ? 0 : 1,
          currentGuess['tim'] == '??' ? 0 : 1,
          my.guesses.length,
        ]

        if(matching(guess,answer)){

            to_update[0] = 2
            to_update[1] = guesses.length + 1

            // the opponent also guessed the anwswer
            if(my.opp_grid[0] == 2){
                //console.log("The opponent guessed it in ", my.opp_grid[1])
                if(guesses.length + 1 < my.opp_grid[1]){
                  pause()
                  MySwal.fire({
                    title: "YOU WIN!",
                    html: <div style={{    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'}}>
                      <CardRenderer guess={currentGuess}/>
                      <span>Guessed in {guesses.length+1} attempts!</span>
          
                    </div>,
                    
                  }).then((value) => {
                //console.log("game has been reset 10")

                    resetGame()
                    startGame()
                  })
                }else if (guesses.length + 1 == my.opp_grid[1]){
                    clearInterval(my.timeout)
                    toast("You lose. You guessed in the same amount of time. But you took longer")
                }else if (guesses.length + 1 < my.opp_grid[1]){
                    clearInterval(my.timeout)
                    toast("You lose")
                }
            }
        }

        

        //console.log(to_update)
        //console.log("Updating", my.this_player, "to", to_update, my.id)
        try {
          updateDoc(doc(db, "rooms", my.id ), {
            [my.this_player] : to_update,
          }).then((a) =>{
            //console.log("SENDING OVER....")
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }

      }

      updateGuesses(prevState => [...prevState, guess])
      // if(needsOpponentGrid) my.guesses = [...guesses, guess]

    updateClearField(true)
    setSelectedPlayer(undefined)

  }
  
  return (
    <>
      <center><h1>Footdle 
        </h1> 

      </center>
      
      <div className='outerHolder'>
        <div className='cardHolderOuter'>
        <CardRenderer guess={currentGuess}/>
        <span>{guesses.length}/{limit} attempts made</span>
        <span>{typeof answer  !== "undefined" ? answer.nam  + isRunning + minutes + ":" + seconds: ""}</span>
        <GuessMatrix guesses = {guesses} answer={answer}/>
        </div>

        <div className='holder'>
          {/* <AdBanner/> */}

          {needsOpponentGrid ?  <span>Opponent Progress: {""+needsOpponentGrid} {""+isRunning} </span> : ""}
          {needsOpponentGrid ? <OpponentMatrix guess = {opponentLatest} /> : ""}
          {(needsOpponentGrid && isRunning )? "Time Left: " + timeAsString(minutes*60 + seconds) :""}
          {needsOpponentGrid ? <br/> : ""}
          <SearchBar players={other_players} selectPlayerFunction={setSelectedPlayer} clearField={clearField} updateClearField={updateClearField} gameActive={gameActive} setSelectedPlayer={setSelectedPlayer}/>
          <CurrentPlayerViewer selectedPlayer = {selectedPlayer} submitPlayer={makeGuess} onclick={undefined} setPlayerMatches={undefined}/>
          <ToastContainer 
            theme="dark" 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
          />
        </div>
      </div>
      



    </>
  )
}

export default App;
