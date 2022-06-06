import logo from '../logo.svg';
import attackers from "../attackers_with_stats.json";

import './App.css';
import players from '../answers_temp.json';
import icons from '../icons.json';
import other_players from '../players_temp.json';
import SearchBar from '../SearchBar/SearchBar';
import IconSearchBar from '../IconSearchBar/IconSearchBar';
import CurrentPlayerViewer from '../CurrentPlayerView/CurrentPlayerViewer';
import HigherLowerRenderer from '../HigherLowerRenderer/HigherLowerRenderer';
import IconCurrentPlayerViewer from '../IconCurrentPlayerView/IconCurrentPlayerViewer';
import GuessMatrix from '../GuessMatrix/GuessMatrix';
import IconCardGuessMatrix from '../IconCardGuessMatrix/IconCardGuessMatrix';
import { useState, useEffect, useRef} from "react";
import CardRenderer from '../CardRenderer/CardRenderer';
import IconCardRenderer from '../IconCardRenderer/IconCardRenderer';
import copy from 'copy-to-clipboard';
import random from "random-seed"
import {Helmet} from "react-helmet";
import InnerHTML from 'dangerously-set-html-content'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2/dist/sweetalert2.js'

import '@sweetalert2/theme-dark/dark.css'
import withReactContent from 'sweetalert2-react-content'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

import { useAlert } from 'react-alert'

import ReactGA from 'react-ga';
import { jsonEval } from '@firebase/util';


function IconApp() {
  const alert = useAlert()
  useEffect(() => {

    setNeedsOpponentGrid(false)

    // Footdle.github.io
    // ReactGA.initialize('UA-159262483-2');

    // Footdle.com  
    ReactGA.initialize('UA-159262483-3');
    ReactGA.pageview(window.location.pathname);
  }, [])

  const MySwal = withReactContent(Swal)
  const PrivacySwal = withReactContent(Swal)

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

    window.adBreak({
      type: 'start',  // ad shows at start of next level or restart of the game
      name: 'start-game'
      // it's good practice to mute and pause gameplay
    });

  }

  const showAdOld = async () => {
    const scriptTag = document.createElement("script");
    // footdle.github
    // scriptTag.src = "//upgulpinon.com/1?z=4912989";
    // footdle.com
    scriptTag.src = "//upgulpinon.com/1?z=4919531";
    scriptTag.async = true;
    scriptTag.setAttribute("data-cfasync", "false")
    document.body.appendChild(scriptTag);
  }

  const [selectedPlayer, setSelectedPlayer] = useState(undefined)
  const [guesses, updateGuesses] = useState([])
  const [clearField, updateClearField] = useState(false)
  const [answer, setAnswer] = useState({})
  const [iconAnswer, setIconAnswer] = useState({})
  const [currentGuess, setCurrentGuess] = useState({"pos":"??","lig":"??","lig_url":"??", "tim":"??","nat":"??","nam_long":"??", "nam":"??", "img": "https://cdn.sofifa.com/players/230/481/22_60.png", "tim_url":"??"})
  const [shareMatrix, setShareMatrix] = useState("")
  const [needsShare, setNeedsShare] = useState(false)
  const [gameActive, setGameActive] = useState(true)
  const [currentGameIsDaily, setCurrentGameIsDaily] = useState(false)
  const [needsOpponentGrid, setNeedsOpponentGrid] = useState(false)
  const [opponentLatest, setOpponentLatest] = useState([])
  const [currentGameIsIcon, setCurrentGameIsIcon] = useState(false)
  const [currentGameIsHigherLower, setCurrentGameIsHigherLower] = useState(false)
  const [leftAttacker, setLeftAttacker] = useState(false)
  const [rightAttacker, setRightAttacker] = useState(false)
  const [statistic, setStatistic] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)

  const componentRef = useRef({});
  const { current: my } = componentRef;

  const limit = 12

  const resetGame = () => {

    updateGuesses([])
    setGameActive(true)
    setSelectedPlayer(undefined)
    setCurrentGuess({"pos":"??","lig":"??","lig_url":"??", "tim":"??","nat":"??", "nam_long":"??", "nam":"??", "img": "https://cdn.sofifa.com/players/230/481/22_60.png", "tim_url":"??"})
    setCurrentGameIsDaily(false)
    setCurrentGameIsIcon(false)
    return
    console.log("resetting games")
    setGameActive(true)

    setSelectedPlayer(undefined)
    updateGuesses([])
    setCurrentGuess({"pos":"??","lig":"??","lig_url":"??", "tim":"??","nat":"??", "nam_long":"??", "nam":"??", "img": "https://cdn.sofifa.com/players/230/481/22_60.png", "tim_url":"??"})

    // let l = Math.floor(Math.random() * players.length);
    // setAnswer(players[l])
    // console.log(players[l])

  }
  
  useEffect(() =>{
  }, [selectedPlayer])
  
  const matching = (guess, answer) => {

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
    if(guesses.length >= limit && !matching(guess,answer)){
      setGameActive(false)

      if(currentGameIsDaily && !currentGameIsIcon){
        // console.log('daily loss')
        my.current_streak = localStorage.getItem('streakData')
        if(my.current_streak !== null){
          // console.log('daily removed')
          localStorage.removeItem('streakData')
        }
      }

      if(currentGameIsIcon){
        MySwal.fire({
          title: <p>You lose -- Icon.</p>,
          html: <div style={{    display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'}}>
              <IconCardRenderer guess={answer}/>
            </div>,
          
          confirmButtonText:'Share Result',
          cancelButtonText:'Back to Main Menu',
          showConfirmButton: currentGameIsDaily,
          showCancelButton:true,
          allowOutsideClick:false,
          allowEscapeKey:false
        }).then((value) =>{

          if(value.isConfirmed){
            let s = iconShareText(false)
            copy(s)
            MySwal.fire({
              toast:true,
              timer:3000,
              text:"Copied result to Clipboard!"      
            })

            
            
          }else if(value.isDismissed){

            // Reset the game
            // Reset the game
            resetGame()
            showMenu()
          }
    
        })
      }else
        MySwal.fire({
          title: <p>You lose.</p>,
          html: <div style={{    display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'}}>
              { currentGameIsDaily ? "Current Streak: 0 days":""}
              
              <CardRenderer guess={answer}/>
            </div>,
          
          confirmButtonText:'Share Result',
          cancelButtonText:'Back to Main Menu',
          showConfirmButton: currentGameIsDaily,
          showCancelButton:true,
          allowOutsideClick:false,
          allowEscapeKey:false
        }).then((value) =>{

          if(value.isConfirmed){
            let s = shareText(false)
            copy(s)
            MySwal.fire({
              toast:true,
              timer:3000,
              text:"Copied result to Clipboard!"      
            })
            
          }else if(value.isDismissed){

            // Reset the game
            // Reset the game
            resetGame()
            showMenu()
          }
    
        })
      }

    if(matching(guess,answer)){

      if(!currentGameIsIcon){
        if(currentGameIsDaily){
          my.current_streak = localStorage.getItem('streakData')
          if(my.current_streak === null){
            let s = {
              "day":dayOfYear() + (new Date().getFullYear()),
              "streak":1
            }
            my.current_streak = s
            localStorage.setItem('streakData', JSON.stringify(s))

          }else{
            let s = JSON.parse(localStorage.getItem('streakData'))
            if((dayOfYear() + (new Date().getFullYear())) == (s['day'] + 1)){
              s['streak'] += 1
              s['day'] = (dayOfYear() + (new Date().getFullYear()))
              localStorage.setItem('streakData', JSON.stringify(s))
              my.current_streak = s
            }else{
              
              let s = {
                "day":(dayOfYear() + (new Date().getFullYear())),
                "streak":1
              }
              my.current_streak = s
              localStorage.setItem('streakData', JSON.stringify(s))
              // console.log('won, new streak because been too long since last win')
            }
            
            
          }
        }

        setGameActive(false)
        MySwal.fire({
          title: <p>Correct Guess! {currentGameIsDaily}</p>,
          html: <div style={{    display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'}}>
              {currentGameIsDaily ?  <span>Current Streak:{my.current_streak['streak'] + (my.current_streak['streak'] == 1 ? " day" : " days")}</span>:""}
              <CardRenderer guess={currentGuess}/>
              <span>{guesses.length}/{limit} attempts made</span>
            
            </div>,
          
          confirmButtonText:'Share Result',
          cancelButtonText:'Back to Main Menu',
          showCancelButton:true,
          showConfirmButton:currentGameIsDaily,
          allowOutsideClick:false,
          allowEscapeKey:false
        }).then((value)=>{
          
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
            resetGame()
            showMenu()
          }
    
          
        })

      }else{

        setGameActive(false)
        MySwal.fire({
          title: <p>Correct Guess -- Icon! {currentGameIsDaily}</p>,
          html: <div style={{    display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'}}>
              <IconCardRenderer guess={currentGuess}/>
              <span>{guesses.length}/{limit} attempts made</span>
            
            </div>,
          
          confirmButtonText:'Share Result',
          cancelButtonText:'Back to Main Menu',
          showCancelButton:true,
          showConfirmButton:currentGameIsDaily,
          allowOutsideClick:false,
          allowEscapeKey:false
        }).then((value)=>{
          
          if(value.isConfirmed){
            let s = iconShareText(true)
            copy(s)
            MySwal.fire({
              toast:true,
              timer:3000,
              text:"Copied result to Clipboard!"      
            })
            
          }else if(value.isDismissed){

            // Reset the game
            // Reset the game
            resetGame()
            showMenu()
          }
    
          
        })

      }
      
    }
    // if(needsShare){
    //   let s = shareText(true)
    //   navigator.clipboard.writeText(s)
    //   setNeedsShare(false)

    //   MySwal.fire({
    //     toast:true,
    //     timer:3000,
    //     text:"Copied result to Clipboard!"      
    //   })
    // }

  }, [guesses])

  let startGame = () => {
    let policyAgree = localStorage.getItem('policyAgree')
    if(policyAgree === null) showPrivacyDialog()

    MySwal.fire({
      showCancelButton: true,
      confirmButtonText:"Ok!",
      allowEscapeKey:false,
      title:"Added Icon Mode!",
      html:  <>
      <div style={{overflowY:'auto', fontSize:'small',  fontWeight:50}}>
      <p>Added an Icons Mode!</p>

      
        <p>Now you will see a single advertisment. Thanks for the patience</p>
        <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>
      </div>
      </>,
      showCancelButton: false,
      allowOutsideClick: false,
      
    }).then((value)=>{
      showAd()


      showMenu()
    })

  }

  let showHigherLowerMenu = () =>{
    
    MySwal.fire({
      showCancelButton: true,
      confirmButtonText:"Play",
      cancelButtonText: "Play 2",
      confirmButtonColor:"orange",
      denyButtonColor:"gray",
      showDenyButton:false,
      allowEscapeKey:false,
      html:  <>
          <PerfectScrollbar>
          <div style={{fontSize:'small', height:'50vh', fontWeight:50}}>
      <p> <a href="https://donate.unhcr.org/int/en/ukraine-emergency?gclid=Cj0KCQiA95aRBhCsARIsAC2xvfxJfXIVIYbjYglyykGKYkjFsfetU7UqG44ysm5Yh4L2baQZZ77Sc1kaAk6oEALw_wcB&gclsrc=aw.ds" > Kindly consider donating to Ukrainians in need </a></p>
        <p>Note: Scroll if entire tutorial is not visible :)</p>
        <p> Higher or lower challenge</p>
        </div>
          </PerfectScrollbar>
      
      </>,
      allowOutsideClick: false,
      
    }).then((value)=>{
      setCurrentGameIsHigherLower(true)
      startHigherLowerGame()
    })
}


let checkHigherLower = (selectedAttacker, oppositeAttacker, statistic)  => {


  if(selectedAttacker[statistic] > oppositeAttacker[statistic]){
    console.log("TRUE")

    setCurrentStreak(currentStreak + 1)

    startHigherLowerGame()

    toast.dismiss()
    toast.info(
      <div style={{fontSize:"small"}}>
        Correct. {selectedAttacker[statistic]} {statistic} is higher than {oppositeAttacker[statistic]} {statistic}
      </div>, {
      position: "bottom-center",
      autoClose: true,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      closeButton:true,
      draggable: true,
      progress: undefined}
    )

  }else if(selectedAttacker[statistic] == oppositeAttacker[statistic]){
    setCurrentStreak(currentStreak + 1)
    
    toast.dismiss()
    toast.info(
      <div style={{fontSize:"small"}}>
        Correct. Kind of. {selectedAttacker[statistic]} {statistic} is the same as {oppositeAttacker[statistic]} {statistic}
      </div>, {
      position: "bottom-center",
      autoClose: true,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      closeButton:true,
      draggable: true,
      progress: undefined}
    )

    startHigherLowerGame()
  }else{

    setCurrentStreak(0)
    toast.dismiss()

    toast.info(
      <div style={{fontSize:"small"}}>
        Wrong. {selectedAttacker[statistic]} {statistic} is lower than {oppositeAttacker[statistic]} {statistic}
      </div>, {
      position: "bottom-center",
      autoClose: true,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      closeButton:true,
      draggable: true,
      progress: undefined}
    )

    console.log("FALSE")
    
  }

  console.log('checkHigherLower', selectedAttacker[statistic], oppositeAttacker[statistic], statistic)
}

let startHigherLowerGame = function(){

  let leftI = Math.floor(Math.random() * attackers.length)
  let rightI = Math.floor(Math.random() * attackers.length)

  let attacking_statistics = ['goals', 'assists', 'mins', 'penalties']

  let statistic = attacking_statistics[Math.floor(Math.random() * attacking_statistics.length)]

  setLeftAttacker(attackers[leftI])
  setRightAttacker(attackers[rightI])
  setStatistic(statistic)
  
}

  let showIconMenu = () =>{
    
    let tutorial_guesses = [{
      "rat": 97,
      "pos": "CAM",
      "name": "ZIDANE",
      "pac": 86,
      "sho": 93,
      "pas": 98,
      "dri": 98,
      "def": 76,
      "phy": 88,
      "id": 3
  },
  {
    "rat": 94,
    "pos": "RB",
    "name": "CARLOS ALBERTO",
    "pac": 92,
    "sho": 79,
    "pas": 83,
    "dri": 88,
    "def": 92,
    "phy": 89,
    "id": 13
}]

    let tutorial_answer = {
      "rat": 95,
      "pos": "LW",
      "name": "RONALDINHO",
      "pac": 94,
      "sho": 93,
      "pas": 92,
      "dri": 98,
      "def": 39,
      "phy": 82,
      "id": 7
  }

    let shouldShowToday = true
    if(localStorage.getItem('streakData') !== null){
      let s = JSON.parse(localStorage.getItem('streakData'))
      if(s['day'] == (dayOfYear() + new Date().getFullYear())){
        // console.log('you already did it today')
        shouldShowToday = false
      }
    }

    MySwal.fire({
      showCancelButton: true,
      confirmButtonText:"Today's Icon Challenge",
      cancelButtonText: "Random Icon Challenge",
      confirmButtonColor:"orange",
      denyButtonColor:"gray",
      showDenyButton:false,
      allowEscapeKey:false,
      html:  <>
          <PerfectScrollbar>
          <div style={{fontSize:'small', height:'50vh', fontWeight:50}}>
      <p> <a href="https://donate.unhcr.org/int/en/ukraine-emergency?gclid=Cj0KCQiA95aRBhCsARIsAC2xvfxJfXIVIYbjYglyykGKYkjFsfetU7UqG44ysm5Yh4L2baQZZ77Sc1kaAk6oEALw_wcB&gclsrc=aw.ds" > Kindly consider donating to Ukrainians in need </a></p>
        <p>Note: Scroll if entire tutorial is not visible :)</p>
        <p>A random player has been chosen from Prime Icon Moments from Fifa 22. The aim is to guess which player it is within {limit} attempts, by using players themselves as guesses.</p>
        <hr></hr>
        <p>Consider the case where our guess is Zidane. Since there is a downwards arrow next to the rating, we know that the actual answer is a player that is rated 96 or lower. We also know that he isn't a CAM, and that he isn't French.</p>
        <div className='holder'>
          <IconCardGuessMatrix guesses = {[tutorial_guesses[0]]} answer={tutorial_answer} demo={true} />
        </div>
        <hr></hr>
        <p>In this next case we have guessed Carlos Alberto. Given the information we have received from this guess, we now know that the answer is a Brazilian player rated 95 or 96.</p>
        <div className='holder'>
          <IconCardGuessMatrix guesses = {[tutorial_guesses[1]]} answer={tutorial_answer} demo={true}/>
        </div>

        <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>
      </div>
          </PerfectScrollbar>
      
      </>,
      allowOutsideClick: false,
      
    }).then((value)=>{
      if(value.isConfirmed || value.isDismissed){
        setCurrentGameIsIcon(true)
        let random_gen_func = null;
        if(value.isConfirmed){
          setCurrentGameIsDaily(true)
          random_gen_func = getTodayRandom
          setCurrentGameIsDaily(true)
        }else if(value.isDismissed){
          random_gen_func = Math.random
        }

        let l = Math.floor(random_gen_func() * icons.length);
        setAnswer(icons[l])

        // console.log("Selected Icon", icons[l])
        // console.log("setting to icon", true)
        // console.log(icons[l])
      }
    })
}

  let showMenu = () => {

    
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

    let shouldShowToday = true
    if(localStorage.getItem('streakData') !== null){
      let s = JSON.parse(localStorage.getItem('streakData'))
      if(s['day'] == (dayOfYear() + new Date().getFullYear())){
        // console.log('you already did it today')
        shouldShowToday = false
      }
    }

    MySwal.fire({
      showCancelButton: true,
      showConfirmButton: shouldShowToday,
      confirmButtonText:"Today's Challenge",
      denyButtonText: "Higher or Lower",
      // denyButtonText: "Random Challenge",
      denyButtonColor:"gray",
      cancelButtonText:"Icons Mode",
      cancelButtonColor:"orange",
      showDenyButton:true,
      allowEscapeKey:false,
      html:  <>
          <PerfectScrollbar>
          <div style={{fontSize:'small', height:'50vh', fontWeight:50}}>
      <p> <a href="https://donate.unhcr.org/int/en/ukraine-emergency?gclid=Cj0KCQiA95aRBhCsARIsAC2xvfxJfXIVIYbjYglyykGKYkjFsfetU7UqG44ysm5Yh4L2baQZZ77Sc1kaAk6oEALw_wcB&gclsrc=aw.ds" > Kindly consider donating to Ukrainians in need </a></p>
        <p>Note: Scroll if entire tutorial is not visible :)</p>
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
          </PerfectScrollbar>
      
      </>,
      allowOutsideClick: false,
      
    }).then((value)=>{

      if(value.isConfirmed || value.isDenied){
        setCurrentGameIsIcon(false)
        let random_gen_func = null;
        if(value.isConfirmed){
          random_gen_func = getTodayRandom
          setCurrentGameIsDaily(true)

          let l = Math.floor(random_gen_func() * players.length);
        setAnswer(players[l])

        console.log(players[l])
        }else if(value.isDenied){
          showHigherLowerMenu()
        }

        
      }

      // if(value.isConfirmed || value.isDenied){
      //   setCurrentGameIsIcon(false)
      //   let random_gen_func = null;
      //   if(value.isConfirmed){
      //     random_gen_func = getTodayRandom
      //     setCurrentGameIsDaily(true)
      //   }else if(value.isDenied){
      //     random_gen_func = Math.random
      //   }

      //   let l = Math.floor(random_gen_func() * players.length);
      //   setAnswer(players[l])

      //   console.log(players[l])
      // }

      if(value.isDismissed){
        showIconMenu()
      }

    })
  }

  let showPrivacyDialog = () => {

    toast.info(
      <div style={{fontSize:"small"}}>
        By using this website, you are agreeing to our privacy policy. (Click to close)
      </div>, {
      position: "bottom-center",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      closeButton:false,
      draggable: false,
      progress: undefined,
      onClick: () => {
           toast.info(

            ({closeToast}) => 
             <div style={{fontSize:'small', display:"flex", alignItems:'center'}}>
                <span style={{
                   textAlign: 'justify',
                   textJustify: 'inter-word'
                }}>
                  We use third-party advertising companies to serve ads when you visit our Web site. These companies may use aggregated information (not including your name, address, email address or telephone number) about your visits to this and other Web sites in order to provide advertisements about goods and services of interest to you. Cookies or similar type of file to track and target your interests may also be used. If you would like more information about this practice and to know your choices about not having this information used by these companies, click on 'Open Policy'.
                </span>

                <div style={{
                  marginLeft:"1vw",
                  display:"flex",
                  alignSelf:"stretch",
                  flexDirection:"column",
                  justifyContent:"space-evenly"

                }}>
                  <button style ={{
                    height:"45%",
                    marginBottom: "6px",

                  }}
                  onClick={() => {
                    
                    localStorage.setItem('policyAgree', true)
                    closeToast()

                  }}> Agree </button>
                  <button style ={{
                    height:"max(3em, 45%)",
                    
                  }} onClick={() => {
                    window.location= "https://www.networkadvertising.org/understanding-online-advertising/what-are-my-options/"
                  }}> Open Policy </button>

                </div>

             </div>,{
              position: "bottom-center",
              autoClose: false,
              hideProgressBar: false,
              closeOnClick: false,
              closeButton:false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined
            })
        return
        PrivacySwal.fire({
          showCancelButton: false,
          confirmButtonText:"Ok!",
          allowEscapeKey:false,
          allowOutsideClick:false,
          title:"Privacy Policy!",
          html:  <>
          <div style={{overflowY:'auto', fontSize:'small',  fontWeight:50}}>
          We use third-party advertising companies to serve ads when you visit our Web site. These companies may use aggregated information (not including your name, address, email address or telephone number) about your visits to this and other Web sites in order to provide advertisements about goods and services of interest to you. Cookies or similar type of file to track and target your interests may also be used. If you would like more information about this practice and to know your choices about not having this information used by these companies, click  <a href="https://www.networkadvertising.org/understanding-online-advertising/what-are-my-options/">here</a>
          </div>
          </>,
          showCancelButton: false,
          allowOutsideClick: false,
          
        }).then((value)=>{
          // startGame()

        })
      }
    });
    // MySwal.fire({
    //   showCancelButton: false,
    //   confirmButtonText:"Ok!",
    //   allowEscapeKey:false,
    //   allowOutsideClick:false,
    //   title:"Privacy Policy!",
    //   html:  <>
    //   <div style={{overflowY:'auto', fontSize:'small',  fontWeight:50}}>
    //   We use third-party advertising companies to serve ads when you visit our Web site. These companies may use aggregated information (not including your name, address, email address or telephone number) about your visits to this and other Web sites in order to provide advertisements about goods and services of interest to you. Cookies or similar type of file to track and target your interests may also be used. If you would like more information about this practice and to know your choices about not having this information used by these companies, click  <a href="https://www.networkadvertising.org/understanding-online-advertising/what-are-my-options/">here</a>
    //   </div>
    //   </>,
    //   showCancelButton: false,
    //   allowOutsideClick: false,
      
    // }).then((value)=>{
    //   localStorage.setItem('policyAgree', true)
    //   startGame()

    // })
  }

  useEffect(() =>{
    <Helmet>
      {/* Footdle.github.io */}
      {/* <meta name="propeller" content="76e70fd611122a7004438cc2477e50fb"/> */}
      
      {/* Footdle.com */}
      {/* <meta name="propeller" content="a253337b724e85d093ee17ea169bceea"/> */}
    </Helmet>
    document.title = "Footdle"

      startGame()
    

  }, [])

  const generateIconText = () => {
    const playerNTs = ['54', '52', '54', '18', '23', '34', '54', '54', '27', '40', '35', '34', '54', '54', '14', '27', '27', '45', '45', '38', '18', '34', '21', '18', '14', '45', '38', '21', '27', '52', '9', '45', '14', '50', '14', '52', '45', '27', '34', '27', '83', '34', '34', '34', '27', '54', '42', '103', '13', '34', '18', '54', '12', '18', '21', '54', '27', '108', '12', '21', '50', '45', '13', '14', '34', '14', '18', '14', '18', '18', '14', '21', '49', '34', '45', '54', '39', '38', '14', '27', '52', '45', '46', '52', '117', '27', '18', '18', '133', '17', '51', '38', '83', '14', '34', '27', '25', '10', '14', '14', '14', '27', '14', '163']


    let st = ''

    for (let i = 0; i < guesses.length; i ++){
      let player = guesses[i]
      let rat_ind = '🟥'
      if(player.rat == answer.rat) rat_ind = '🟩'
      else if(player.rat > answer.rat) rat_ind = '🔻'
      else if (player.rat < answer.rat) rat_ind = '🔺'
      let pos_ind = player.pos == answer.pos ? '🟩' : '🟥'
      let nat_ind = playerNTs[player.id] == playerNTs[answer.id] ? '🟩' : '🟥'

      st += pos_ind + rat_ind + nat_ind 

      if(i < guesses.length-1){ st += "\n"}
    }

    return st
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
    showAd()

    let m = managed ? guesses.length:'X'
    let st = "Footdle " +dayOfYear()+" - "+ m +'/'+limit+'\n' + generateShareText()

    return st
  }

  const iconShareText = (managed) =>{ 
    showAd()

    let m = managed ? guesses.length:'X'
    let st = "Footdle Icons " +dayOfYear()+" - "+ m +'/'+limit+'\n' + generateIconText()

    return st
  }


  const makeGuess = (guess) => {

      Object.entries(guess).map((a,i) =>{
        if(guess[a[0]] == answer[a[0]]) currentGuess[a[0]] = answer[a[0]]
      })

      updateGuesses(prevState => [...prevState, guess])

    updateClearField(true)
    setSelectedPlayer(undefined)

  }
  
  return (
    <>
      <center><h1>Footdle {currentGameIsIcon ? ' - Icons' : ''}</h1></center>
      
      {
        currentGameIsHigherLower ?
        <div style ={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        Current streak: {currentStreak} <br></br>


        <HigherLowerRenderer leftAttacker={leftAttacker} rightAttacker={rightAttacker} statistic={statistic} selectedFunction={checkHigherLower}/>
        <ToastContainer 
                      theme="dark" 
                      position="middle-center"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover={false}
                      style={{ width: "100%" }}
                    />
      </div>
      : ''
      }
      

      {( () =>{
          if(currentGameIsHigherLower){
          }else{
            return <>
            <div className='outerHolder'>
              <div className='cardHolderOuter'>
                {currentGameIsIcon == true ? "": <CardRenderer guess={currentGuess}/>}
                <span>{guesses.length}/{limit} attempts made</span>
                {currentGameIsIcon == true ? <IconCardGuessMatrix guesses = {guesses} answer={answer} demo={false}/>: <GuessMatrix guesses = {guesses} answer={answer}/>}
              </div>
              <div className='holder'>
                {currentGameIsIcon == true ?
                  <IconSearchBar players={icons} selectPlayerFunction={setSelectedPlayer} clearField={clearField} updateClearField={updateClearField} gameActive={gameActive} setSelectedPlayer={setSelectedPlayer}/>
                    :
                      <SearchBar players={other_players} selectPlayerFunction={setSelectedPlayer} clearField={clearField} updateClearField={updateClearField} gameActive={gameActive} setSelectedPlayer={setSelectedPlayer}/>
                    }

                    {currentGameIsIcon == true ?
                      <IconCurrentPlayerViewer selectedPlayer = {selectedPlayer} submitPlayer={makeGuess} onclick={undefined} setPlayerMatches={undefined}/>
                    :
                      <CurrentPlayerViewer selectedPlayer = {selectedPlayer} submitPlayer={makeGuess} onclick={undefined} setPlayerMatches={undefined}/>
                    }
                    <ToastContainer 
                      theme="dark" 
                      position="middle-center"
                      autoClose={10000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover={false}
                      style={{ width: "100%" }}
                    />
                </div>
                </div>
            </>
          }
      })()}

      

          

      



    </>
  )
}

export default IconApp;
