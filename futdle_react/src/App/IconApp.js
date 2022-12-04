// import logo from '../logo.svg';
import attackers from "../HigherLower/attackers_with_stats.json";
import kits17 from "../Kit/17_kit_info.json"
import kits19 from "../Kit/19_kit_info.json"
import kits20 from "../Kit/20_kit_info.json"
import kits21 from "../Kit/21_kit_info.json"
import kits22 from "../Kit/22_kit_info.json"

import club_names from "../club_names.json"
import './App.css';
import players from '../ThroughTheYears/pool.json';
import icons from '../icons.json';
import other_players from '../entire_list.json';
import SearchBar from '../Classic/SearchBar/SearchBar';
import IconSearchBar from '../Icon/IconSearchBar/IconSearchBar';
import CurrentPlayerViewer from '../Classic/CurrentPlayerView/CurrentPlayerViewer';
import HigherLowerRenderer from '../HigherLower/HigherLowerRenderer/HigherLowerRenderer';
import IconCurrentPlayerViewer from '../Icon/IconCurrentPlayerView/IconCurrentPlayerViewer';
import GuessMatrix from '../Classic/GuessMatrix/GuessMatrix';
import IconCardGuessMatrix from '../Icon/IconCardGuessMatrix/IconCardGuessMatrix';
import { useState, useEffect, useRef} from "react";
import CardRenderer from '../Classic/CardRenderer/CardRenderer';
import IconCardRenderer from '../Icon/IconCardRenderer/IconCardRenderer';
import copy from 'copy-to-clipboard';
import random from "random-seed"
import {Helmet} from "react-helmet";
import InnerHTML from 'dangerously-set-html-content'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2/dist/sweetalert2.js'

import hlf_pool from '../HigherLowerFifa/hlf_pool.json';

import '@sweetalert2/theme-dark/dark.css'
import withReactContent from 'sweetalert2-react-content'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

import Random from 'java-random'

import { useAlert } from 'react-alert'

import ReactGA from 'react-ga';
import GuessWhoRenderer from '../GuessWho/GuessWhoRenderer/GuessWhoRenderer';
import GuessWhoSearchBar from '../GuessWho/GuessWhoSearchBar/GuessWhoSearchBar';
import good_ones from '../GuessWho/guess_who_data/good_ones_2.json';
import GuessWhoCurrentPlayerViewer from '../GuessWho/GuessWhoCurrentPlayerViewer/GuessWhoCurrentPlayerViewer';
import GuessWhoPlayerRenderer from '../GuessWho/GuessWhoPlayerRenderer/GuessWhoPlayerRenderer';
import KitClashRenderer from '../Kit/KitClashRenderer/KitClashRenderer';
import KitSearchBar from '../Kit/KitSearchBar/KitSearchBar';
import KitCurrentClubViewer from '../Kit/KitCurrentClubViewer/KitCurrentClubViewer';
import KitGuesses from '../Kit/KitGuesses/KitGuesses';

import ThroughTheYearsRenderer from "../ThroughTheYears/ThroughTheYearsRenderer/ThroughTheYearsRenderer";
import pool from "../ThroughTheYears/pool.json";
import classic_pool from "../answer_pool.json";
import ThroughTheYearsPlayerRenderer from "../ThroughTheYears/ThroughTheYearsPlayerRenderer/ThroughTheYearsPlayerRenderer";
import HigherLowerFifaRenderer from "../HigherLowerFifa/HLFRenderer/HLFRenderer";

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

  useEffect( () => {
    window.gen_random = -1
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
  const [currentGuess, setCurrentGuess] = useState({'overall': '??',  'short_name': '??',  'full_name': '??',  'position': '??',  'img_id': '230323',  'country': '??',  'country_code': '??',  'club_id': '??',  'club': '??',  'league': '??'})
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
  const [currentGameIsGuessWho, setCurrentGameIsGuessWho] = useState(false)
  const [guessWhoAnswer, setGuessWhoAnswer] = useState({'list_of_team_mates':[], 'player_info':{}})
  const [selectedGuessWhoPlayer, setSelectedGuessWhoPlayer] = useState(undefined)
  const [clearGuessWhoField, setClearGuessWhoField] = useState(false)
  const [clearKitField, setClearKitField] = useState(false)
  const [guessWhoGuessMatrix, setGuessWhoGuessMatrix] = useState([])
  const [genFunc, setGenFunc] = useState(-1)
  const componentRef = useRef({});
  const [hintCount, setHintCount] = useState(0)
  const { current: my } = componentRef;
  const [testStreak, setTestStreak] = useState("")
  const [testMode, setTestMode] = useState(false)
  const [currentGameModeIsTTY, setCurrentGameModeIsTTY] = useState(false)
  const [currentGameModeIsHLF, setCurrentGameModeIsHLF] = useState(false)


  var gen_func = -1;
  const limit = 12
  const hint_limit = 4;
  const [kitClashAnswer, setKitClashAnswer] = useState({'kit_url':'__'})
  const [ttyAnswer, setTTYAnswer] = useState([])
  const [hlfAnswer, setHLFAnswer] = useState([])
  const [currentGameIsKitClash, setCurrentGameIsKitClash] = useState(false)
  const [kitClashGuesses, setKitClashGuesses] = useState([])
  
  const [selectedKitClashPlayer, setSelectedKitClashPlayer] = useState(undefined)

  const resetGame = () => {
    updateGuesses([])
    setGameActive(true)
    setSelectedPlayer(undefined)
    setCurrentGuess({'overall': '??',  'short_name': '??',  'full_name': '??',  'position': '??',  'img_id': '230323',  'country': '??',  'country_code': '??',  'club_id': '??',  'club': '??',  'league': '??'})
    setCurrentGameIsDaily(false)
    setCurrentGameIsHigherLower(false)
    setCurrentGameIsIcon(false)
    setCurrentGameIsHigherLower(false)
    setGuessWhoAnswer({'list_of_team_mates':[], 'player_info':{}})
    setGuessWhoGuessMatrix([])
    setSelectedGuessWhoPlayer(undefined)
    setCurrentGameIsGuessWho(false)
    setCurrentGameModeIsTTY(false)
    setCurrentGameModeIsHLF(false)
    setHintCount(0)

    return
    console.log("resetting games")
    setGameActive(true)

    setSelectedPlayer(undefined)
    updateGuesses([])
    setCurrentGuess({'overall': '??',  'short_name': '??',  'full_name': '??',  'position': '??',  'img_id': '230323',  'country': '??',  'country_code': '??',  'club_id': '??',  'club': '??',  'league': '??'})
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
          position:'top',
          html: <div style={{    display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'}}>
              <IconCardRenderer guess={answer}/>
            </div>,
          
          confirmButtonText:'Share Result',
          cancelButtonText:'Back to Main Menu',
          cancelButtonColor:"red",
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
          position:'top',
          html: <div style={{    display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'}}>
              { currentGameIsDaily ? "Current Streak: 0 days":""}
              
              <CardRenderer guess={answer}/>
            </div>,
          
          confirmButtonText:'Share Result',
          cancelButtonText:'Back to Main Menu',
          cancelButtonColor:"red",
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
          position:'top',
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
          position:'top',
          html: <div style={{    display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'}}>
              <IconCardRenderer guess={currentGuess}/>
              <span>{guesses.length}/{limit} attempts made</span>
            
            </div>,
          
          confirmButtonText:'Share Result',
          cancelButtonText:'Back to Main Menu',
          cancelButtonColor:"Red",
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

  }, [guesses])

  let startGame = () => {

    let shouldShowUpdate = true
    if(true || localStorage.getItem('ipw_update') === null){
      localStorage.setItem('ipw_update', "set")
      console.log("didnt show")
      MySwal.fire({
        showCancelButton: true,
        confirmButtonText:"Ok!",
        allowEscapeKey:false,
        title:"New Game Mode!!",
        position:'top',
        html:  <>
        <div style={{overflowY:'auto', fontSize:'small',  fontWeight:50}}>
          <p>Through The Years</p>
          <p>Added a new game mode called Through The Years, where you try to guess the player from their old Fifa Cards</p>
          <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>
        </div>
        </>,
        showCancelButton: false,
        allowOutsideClick: false,
        
      }).then((value)=>{
        showAd()
        showMenu()
      })

    }else{
      console.log("Alreadt showed upw")
      showAd()
      showMenu()
    }


    // let policyAgree = localStorage.getItem('policyAgree')
    // if(policyAgree === null) showPrivacyDialog()

    

  }

  let showHigherLowerMenu = () =>{

   let temp_left = {
      "key": 7,
      "pos": "ST",
      "nat": "PT",
      "lig": "English Premier League",
      "tim": "Manchester United",
      "tim_url": "https://cdn.sofifa.net/teams/11/90.png",
      "nam": "cristiano ronaldo",
      "nam_long": "c. ronaldo dos santos aveiro",
      "img": "https://cdn.sofifa.net/players/020/801/22_180.png",
      "lig_url": "LeagueIcons/epl.png",
      "goals": 18,
      "assists": 3,
      "mins": 2487,
      "penalties": 3
  }

  let temp_right = {
      "key": 0,
      "pos": "RW",
      "nat": "AR",
      "lig": "French Ligue 1",
      "tim": "Paris Saint-Germain",
      "tim_url": "https://cdn.sofifa.net/teams/73/90.png",
      "nam": "l. messi",
      "nam_long": "lionel messi",
      "img": "https://cdn.sofifa.net/players/158/023/22_180.png",
      "lig_url": "LeagueIcons/lu.png",
      "goals": 6,
      "assists": 14,
      "mins": 2153,
      "penalties": 0
  }
    
    MySwal.fire({
      showCancelButton: true,
      confirmButtonText:"Daily Challenge",
      cancelButtonText: "Back to Main Menu",
      cancelButtonColor: "darkred",
      denyButtonText:"Random Challenge",
      confirmButtonColor:"darkgreen",
      denyButtonColor:"#484848",
      showDenyButton:true,
      allowEscapeKey:false,
      position:'top',
      html:  <>
          <PerfectScrollbar>
          <div style={{fontSize:'small', height:'50vh', fontWeight:50, fontSize:'large'}}>
      <p> <a href="https://donate.unhcr.org/int/en/ukraine-emergency?gclid=Cj0KCQiA95aRBhCsARIsAC2xvfxJfXIVIYbjYglyykGKYkjFsfetU7UqG44ysm5Yh4L2baQZZ77Sc1kaAk6oEALw_wcB&gclsrc=aw.ds" > Kindly consider donating to Ukrainians in need </a></p>
        <p>Note: Scroll if entire tutorial is not visible :)</p>
        <p> You will be asked which player has obtained the most goals, scored the most penalties, played the most minutes, or assisted the most in league games this season, between two players. You must select which player has the most of the seleted statistic. An example is shown below between Messi and Ronaldo's <strong>league goals</strong> from the 21/22 season : </p>
        <div>
          <HigherLowerRenderer leftAttacker={temp_left} rightAttacker={temp_right} statistic={'goals'} lost={true} smallMode={true}></HigherLowerRenderer>

        </div>
        <p>
          Thus, if you clicked on Ronaldo, then you would be correct. If not, then you will lose. If they are tied then you are awarded a point either way. Your goals ito get the longest possible streak without losing! Good luck :)
        </p>
        <p>IMPORTANT: The statistics are drawn from Season 21/22 games played in the Top 5 Leagues. If a player played outside the top 5 leagues, and signed to a top 5 league club in January, the statistics are only counted from January.</p>
        <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>

        </div>
          </PerfectScrollbar>
      
      </>,
      allowOutsideClick: false,
      
    }).then((value)=>{
      let rng = new Random()

      if(value.isDismissed){
        showMenu()
      }else if(value.isConfirmed){
        setCurrentGameIsHigherLower(true)

        let today_seed = dayOfYear() + (new Date().getFullYear())
        rng.setSeed(today_seed)

        ReactGA.event({
          category: 'hl_daily',
          action: 'Started higher/lower daily random game'
        });

        window.gen_random = rng.doubles()
        setGameActive(true)
        startHigherLowerGame()
        setCurrentGameIsDaily(true)
      }else if(value.isDenied){
        setCurrentGameIsHigherLower(true)

        let random_seed = Math.random()*1000000
        rng.setSeed(random_seed)

        ReactGA.event({
          category: 'hl_random',
          action: 'Started higher/lower random game'
        });

        window.gen_random =rng.doubles()
        setGameActive(true)
        startHigherLowerGame()
      }

      
    })
}


let checkHigherLower = (selectedAttacker, oppositeAttacker, statistic)  => {


  if(selectedAttacker[statistic] >= oppositeAttacker[statistic]){

    setCurrentStreak(currentStreak + 1)
    startHigherLowerGame()

  }else{
    setGameActive(false)
    MySwal.fire({
      title: <p>You lose!</p>,
      position:'top',
      html: <div style={{    display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'}}>
          <>
            Your streak was {currentStreak}
            <HigherLowerRenderer leftAttacker={leftAttacker} rightAttacker={rightAttacker} statistic={statistic} selectedFunction={checkHigherLower} lost={true} smallMode={true}/>
          </>

        </div>,
      
      confirmButtonText:'Share Result',
      cancelButtonText:'Back to Main Menu',
      cancelButtonColor:'red',
      showConfirmButton:currentGameIsDaily,
      showCancelButton:true,
      allowOutsideClick:false,
      allowEscapeKey:false
    }).then((value) =>{

      if(value.isConfirmed){
        let s = highLowShareText(false)
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
        setCurrentStreak(0)

      }
    })
  }
}

let startHigherLowerGame = function(){
  // console.log('Getting next random numbers')

  // console.log(window.gen_random)
  let leftI = Math.floor(window.gen_random.next().value* attackers.length)
  let rightI = Math.floor(window.gen_random.next().value * attackers.length)

  // console.log(leftI, rightI)

  let attacking_statistics = ['goals', 'assists', 'mins', 'penalties', 'fouls_made', 'fouls_won', 'yellow_cards', 'crosses','offsides', 'interceptions']

  let statistic = attacking_statistics[Math.floor(window.gen_random.next().value * attacking_statistics.length)]

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
      denyButtonText: "Random Icon Challenge",
      denyButtonColor:'#484848',
      confirmButtonColor:"#343f81",
      showDenyButton:true,
      cancelButtonText:"Back to Main Menu",
      cancelButtonColor:'darkred',
      allowEscapeKey:false,
      position:'top',
      html:  <>
          <PerfectScrollbar>
          <div style={{fontSize:'small', height:'50vh', fontWeight:50,  fontSize:'large'}}>
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
      if(value.isConfirmed || value.isDenied){
        setCurrentGameIsIcon(true)
        let random_gen_func = null;
        if(value.isConfirmed){
          setCurrentGameIsDaily(true)
          random_gen_func = getTodayRandom

          ReactGA.event({
            category: 'icon_daily',
            action: 'Started icon daily footdle game'
          });

        }else if(value.isDenied){
          random_gen_func = Math.random
          ReactGA.event({
            category: 'icon_random',
            action: 'Started icon random footdle game'
          });
        }

        let l = Math.floor(random_gen_func() * icons.length);
        // console.log(icons[l])
        setAnswer(icons[l])
      }else if(value.isDismissed){
        showMenu()
      }
    })
}


let showMenu = () => {
  MySwal.fire({
    showCancelButton: false,
    showConfirmButton: false,
    confirmButtonColor:'#a77e05',
    confirmButtonText:"Footdle",
    denyButtonText: "Footdle Icons",
    cancelButtonColor:"darkgreen",
    cancelButtonText:"Footdle Higher/Lower",
    denyButtonColor:"#343f81",
    showConfirmButton:false,
    position:'top',
    showDenyButton:false,
    title:"Games Menu",
    allowEscapeKey:false,
    position:'top',
    html:  <>
        <PerfectScrollbar>
        {/* <div style={{fontSize:'small', height:'50vh', fontWeight:50}}> */}
          {/* Choose which version of the game you want to play.
        <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p> */}

        <div className="gridHolder">
                <input type = "Button" style={{backgroundImage:'url("menu/classic.png")'}}className={"select_game_button"} onClick={showClassicMenu} defaultValue="Footdle"/> 
                <input type = "Button" style={{backgroundImage:'url("menu/icons.png")'}} className={"select_game_button"} onClick={showIconMenu} defaultValue="Icons"/> 
                <input type = "Button" style={{backgroundImage:'url("menu/higherLower.png")'}} className={"select_game_button"} onClick={showHigherLowerMenu} defaultValue="Higher/Lower"/>
                <input type = "Button"  style={{backgroundImage:'url("menu/ipw.png")'}}  className={"select_game_button"} onClick={showGuessWhoMenu} defaultValue="I Played With"/>
                <button style={{backgroundImage:'url("menu/tty.png")'}}  className={"select_game_button"} onClick={showThroughTheYearsMenu}>Through the Years</button>
                <input type = "Button"  style={{backgroundImage:'url("menu/kit.png")'}}  className={"select_game_button"} onClick={showHLFMenu} defaultValue="StatsBomb"/>
          
        </div>
        <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p> 
        {/* </div> */}
        </PerfectScrollbar>
    
    </>,
    allowOutsideClick: false,
    
  }).then((value)=>{
    // console.log(value)
    if(value.isConfirmed){
      // showClassicMenu()
      showGuessWhoMenu()
    } else if(value.isDenied){
      showIconMenu()
    } else if(value.isDismissed){
      showHigherLowerMenu()
    }
  })
}

  let showGuessWhoMenu = () => {
    MySwal.fire({
      showCancelButton: true,
      showDenyButton:true,
      confirmButtonText:"Daily Challenge",
      denyButtonText:"Random Challenge",
      cancelButtonText:"Back to Main Menu",
      allowEscapeKey:false,
      // title:"I Played With",
      position:'top',
      html:  <>
      <div style={{overflowY:'auto', fontSize:'medium',  maxHeight:"50vh", fontWeight:50}}>
        <p>In this game mode, you will be given 4 or more seemingly unrelated players. However, there is a single player who has played with all of them at some point in their career. You must guess who that player is based on the hints the game will give you. The answer can be any player from the last 15 years that has played at atleast 4 different clubs during this period.</p>
        <p><strong>NOTE: This game is only about player that played together at club level, not national team level.</strong></p>
        <p>The game will give the following hints:</p>
        <ul>
          <li>The club he played with them at.</li>
          <li>The player's nationality and position</li>
        </ul>
        <p>For each guess you make, the game will also let you know if the guess played with the answer at any point in their career!</p>
        <p> You can press "Give Hint" to move on to the next clue, however this will cost you 1 attempt.</p>
        <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>
      </div>
      </>,
      showConfirmButton: true,
      allowOutsideClick: false,
      
    }).then((value)=>{
      // console.log(value)
      if(value.isConfirmed){
        setGameActive(true)
        setCurrentGameIsGuessWho(true)
        startGuessWhoGame(true)
        setCurrentGameIsDaily(true)

      }else if(value.isDenied){
        setGameActive(true)
        setCurrentGameIsGuessWho(true)
        startGuessWhoGame(false)
        setCurrentGameIsDaily(false)
      }else if(value.isDismissed){
        showMenu()
      }

     
    })
  }

  let showKitClashMenu = () => {
    MySwal.fire({
      showCancelButton: true,
      showDenyButton:true,
      confirmButtonText:"Daily Challenge",
      denyButtonText:"Random Challenge",
      cancelButtonText:"Back to Main Menu",
      allowEscapeKey:false,
      // title:"I Played With",
      position:'top',
      html:  <>
      <div style={{overflowY:'auto', fontSize:'medium',  maxHeight:"50vh", fontWeight:50}}>
        <p>Kit Clash</p>
        <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>
      </div>
      </>,
      showConfirmButton: true,
      allowOutsideClick: false,
      
    }).then((value)=>{
      // console.log(value)
      if(value.isConfirmed){
        setGameActive(true)
        setCurrentGameIsKitClash(true)
        startKitClash(true)
        setCurrentGameIsDaily(true)

      }else if(value.isDenied){
        setGameActive(true)
        setCurrentGameIsKitClash(true)
        startKitClash(false)
        setCurrentGameIsDaily(false)
      }else if(value.isDismissed){
        showMenu()
      }

     
    })
  }

  
  let showThroughTheYearsMenu = () => {
    MySwal.fire({
      showCancelButton: true,
      showDenyButton:true,
      confirmButtonText:"Daily Challenge",
      denyButtonText:"Random Challenge",
      cancelButtonText:"Back to Main Menu",
      allowEscapeKey:false,
      position:'top',
      html:  <>
      <div style={{overflowY:'auto', fontSize:'medium',  maxHeight:"50vh", fontWeight:50}}>
        <p>Through The Years</p>

        <span>
          In this game mode, you will be shown the different FIFA cards of players from across different years, without being told who the player is. You will only be given the rating and position the player had in that particular year.
        </span>

        <span>
          You can get hints by pressing the 'Give Hint' button, which will give you the following hints in order:
          <ul>
            <li>
              Last club they played for
            </li>

            <li>
              All the clubs they played for
            </li>

            <li>
              Nationality
            </li>
          </ul>

          You have 7 attempts! Good luck :)
        </span>
        <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>
      </div>
      </>,
      showConfirmButton: true,
      allowOutsideClick: false,
      
    }).then((value)=>{
      // console.log(value)
      if(value.isConfirmed){
        setGameActive(true)
        setCurrentGameModeIsTTY(true)
        startTTY(true)
        setCurrentGameIsDaily(true)

        toast.info('Drag the cards horizontally to reveal all of them!', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });

      }else if(value.isDenied){
        setGameActive(true)
        setCurrentGameModeIsTTY(true)
        startTTY(false)
        setCurrentGameIsDaily(false)

        toast.info('Drag the cards horizontally to reveal all of them!', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      }else if(value.isDismissed){
        showMenu()
      }

     
    })
  }

  let showHLFMenu = () => {
    MySwal.fire({
      showCancelButton: true,
      showDenyButton:true,
      confirmButtonText:"Daily Challenge",
      denyButtonText:"Random Challenge",
      cancelButtonText:"Back to Main Menu",
      allowEscapeKey:false,
      position:'top',
      html:  <>
      <div style={{overflowY:'auto', fontSize:'medium',  maxHeight:"50vh", fontWeight:50}}>
        <p>HLF</p>

        <span>
          HIGHER LOWER FIFA STATS hehe
          </span>
        <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>
      </div>
      </>,
      showConfirmButton: true,
      allowOutsideClick: false,
      
    }).then((value)=>{
      // console.log(value)
      if(value.isConfirmed){
        setGameActive(true)
        setCurrentGameModeIsHLF(true)
        startHLF(true)
        setCurrentGameIsDaily(true)


      }else if(value.isDenied){
        setGameActive(true)
        setCurrentGameModeIsHLF(true)
        startHLF(false)
        setCurrentGameIsDaily(false)

      }else if(value.isDismissed){
        showMenu()
      }

     
    })
  }

  

  let showClassicMenu = () => {
      let tutorial_guesses = [{
        "overall": "81",
        "short_name": "A. Romagnoli",
        "full_name": "Alessio Romagnoli",
        "position": "CB",
        "img_id": "210413",
        "country": "Italy",
        "country_code": "it",
        "club_id": "47",
        "club": "AC Milan",
        "league": "LeagueIcons/sa.png"
    },
    
    {
      "overall": "86",
      "short_name": "Y. Tielemans",
      "full_name": "Youri Tielemans",
      "position": "CM",
      "img_id": "216393",
      "country": "Belgium",
      "country_code": "be",
      "club_id": "95",
      "club": "Leicester City",
      "league": "LeagueIcons/epl.png"
  }]

    let tutorial_answer = {
      "overall": "92",
      "short_name": "K. De Bruyne",
      "full_name": "Kevin De Bruyne",
      "position": "CM",
      "img_id": "192985",
      "country": "Belgium",
      "country_code": "be",
      "club_id": "10",
      "club": "Manchester City",
      "league": "LeagueIcons/epl.png"
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
      confirmButtonColor:"#a77e05",
      confirmButtonText:"Today's Challenge",
      // denyButtonText: "Higher or Lower",
      denyButtonText: "Random Challenge",
      denyButtonColor:"#484848",
      cancelButtonText:"Back to Main Menu",
      cancelButtonColor:"darkred",
      showCancelButton:true,
      showDenyButton:true,
      allowEscapeKey:false,
      position:'top',
      html:  <>
          <PerfectScrollbar>
          <div style={{fontSize:'small', height:'40vh', fontWeight:50,  fontSize:'large'}}>
      <p> <a href="https://donate.unhcr.org/int/en/ukraine-emergency?gclid=Cj0KCQiA95aRBhCsARIsAC2xvfxJfXIVIYbjYglyykGKYkjFsfetU7UqG44ysm5Yh4L2baQZZ77Sc1kaAk6oEALw_wcB&gclsrc=aw.ds" > Kindly consider donating to Ukrainians in need </a></p>
        <p>Note: Scroll if entire tutorial is not visible :)</p>
        <p>A random player has been chosen from the top rated players from the Top 5 Leagues on Fifa 23. The aim is to guess which player it is within {limit} attempts, by using players themselves as guesses.</p>
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
      position:'top',
      allowOutsideClick: false,
      
    }).then((value)=>{

      if(value.isConfirmed || value.isDenied){
        setCurrentGameIsIcon(false)
        let random_gen_func = null;
        if(value.isConfirmed){
          random_gen_func = getTodayRandom
          setCurrentGameIsDaily(true)

          ReactGA.event({
            category: 'classic_daily',
            action: 'Started classic daily footdle game'
          });

        }else if(value.isDenied){
          random_gen_func = Math.random
          ReactGA.event({
            category: 'classic_random',
            action: 'Started classic random footdle game'
          });
        }

        let l = Math.floor(random_gen_func() * classic_pool.length);
        // console.log(classic_pool[l])

        setAnswer(classic_pool[l])
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
        showMenu()
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


  let startGuessWhoGame = (today) => {

    if(today){
      ReactGA.event({
        category: 'guesswho_daily',
        action: 'Started guess who daily game'
      });
      console.log("A")
    }else{
      ReactGA.event({
        category: 'guesswho_random',
        action: 'Started guess who random game'
      });
      console.log("B")
    }
    let random_gen_func = today ? getTodayRandom : Math.random
    let guess_answer = good_ones[ Math.floor(random_gen_func()*good_ones.length)]
    setGuessWhoAnswer(guess_answer)
  }

  let startKitClash = (today) => {

    if(today){
      ReactGA.event({
        category: 'guesswho_daily',
        action: 'Started guess who daily game'
      });
      console.log("A")
    }else{
      ReactGA.event({
        category: 'guesswho_random',
        action: 'Started guess who random game'
      });
      console.log("B")
    }
    let random_gen_func = today ? getTodayRandom : Math.random
    let kits = kits17.concat(kits19, kits20, kits21, kits22)
    console.log(kits[0])
    let guess_answer = kits[ Math.floor(random_gen_func()*kits.length)]
    console.log(guess_answer)
    setKitClashAnswer(guess_answer)
  }

  const tty_game_end = (guesses, hint_count, won) => {
    MySwal.fire({
      title: won ? "You win!" : "You Lose!",
      position:'top',
      html: <div>
        <PerfectScrollbar>
          <div className="guess_who_result">
          The answer was:
          {/* get the last guess from guesses */}
          <img style={{width:"min(25vh, 40vw)", height:"min(25vh, 40vw)"}}src={"https://footdle.com/images/big/players/"+Object.values(ttyAnswer)[0]['player_id']+".png"}/>
          <p>{Object.values(ttyAnswer)[0]['name']}</p>

          {currentGameIsDaily ? <button onClick={() => {shareTTYResult(guesses, hint_count, won)}}>Share Result ✉️</button> : ''}
          </div>
        </PerfectScrollbar>
      </div>,
      confirmButtonText: "Back to Main Menu!",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: true,
      showCloseButton: false,
      showCancelButton: false,
    }).then((result) => {

      if (result.isConfirmed) {
        resetGame()
        showMenu()
      }
    })
  }

  let startTTY = (today) => {

    if(today){
      ReactGA.event({
        category: 'tty-daily',
        action: 'Started through the years daily game'
      });
      console.log("A")
    }else{
      ReactGA.event({
        category: 'tty-random',
        action: 'Started through the years random game'
      });
      console.log("B")
    }
    let random_gen_func = today ? getTodayRandom : Math.random
    let guess_answer = pool[ Math.floor(random_gen_func()*pool.length)]
    console.log("set the answer to", guess_answer)
    setTTYAnswer(guess_answer)
  }

  let startHLF = (today) => {

    if(today){
      ReactGA.event({
        category: 'hlf-daily',
        action: 'Started higher lower daily game'
      });
      console.log("A")
    }else{
      ReactGA.event({
        category: 'hlf-random',
        action: 'Started higher lower random fifa game'
      });
      console.log("B")
    }
    let random_gen_func = today ? getTodayRandom : Math.random
    let guess_answer = hlf_pool[ Math.floor(random_gen_func()*hlf_pool.length)]
    console.log("set the answer to", guess_answer)
    setHLFAnswer(guess_answer)
  }

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
      let pos_ind = player.position == answer.position ? '🟩' : '🟥'
      let lig_ind = player.league == answer.league ? '🟩': '🟥'
      let nat_ind = player.country_code == answer.country_code ? '🟩' : '🟥'
      let tim_ind = player.club == answer.club  ? '🟩' : '🟥'

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

  const highLowShareText = (managed) =>{ 
    showAd()

    let m = managed ? guesses.length:'X'
    let st = "Footdle Higher or Lower " +dayOfYear()+"\nStreak: " + currentStreak + " ✅"

    return st
  }

  const shareGuessWhoResult = (managed) =>{

      let st = "Footdle - I Played With " +dayOfYear()+"\n" + 
      (managed ? " I got it in: " + (guessWhoGuessMatrix.length+1) + " attempts ✅, used " + hintCount + (hintCount == 1 ? " hint" : " hints.")
      : "I didn't get it after " + (guessWhoGuessMatrix.length+1) + " attempts ❌, used " + hintCount + (hintCount == 1 ? " hint" : " hints."))

      copy(st)
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

  const shareTTYResult = (guesses, hintCount, won) =>{
    let st = "Footdle - Through The Years " +dayOfYear()+"\n" +
    (won ? " I got it in: " + (guesses.length+1) + " attempts ✅, used " + hintCount + (hintCount == 1 ? " hint" : " hints.")
      : "I didn't get it after " + (guesses.length+1) + " attempts ❌, used " + hintCount + (hintCount == 1 ? " hint" : " hints."))

    copy(st)
    toast.info('Copied result to the clipboard!', {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
    return st
  }

  const makeGuessWhoGuess = (player) => {
    if(player != "empty_guess" && guessWhoAnswer['player_info']['player_id'] == selectedGuessWhoPlayer['player_id']){
      // Swal saying you win
      MySwal.fire({
        title: "You win!",
        position:'top',
        html: <div>
          <PerfectScrollbar>
            <div className="guess_who_result">
            You guessed the correct player!
            <GuessWhoPlayerRenderer player={[player['player_id'], 0]} show_club={false} hidden={false}/>
            {currentGameIsDaily ? <button onClick={() => {shareGuessWhoResult(true)}}>Share Result</button> : ''}
            </div>
          </PerfectScrollbar>
        </div>,
        confirmButtonText: "Back to Main Menu!",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: true,
        showCloseButton: false,
        showCancelButton: false,
      }).then((result) => {

        if (result.isConfirmed) {
          resetGame()
          showMenu()
        }
      })
    }else{
      if(guessWhoGuessMatrix.length >= 8-1){
        MySwal.fire({
          title: "You Lose!",
          position:'top',
          html: <div>
            <PerfectScrollbar>
              <div className="guess_who_result">
              The answer was:
              <GuessWhoPlayerRenderer player={[guessWhoAnswer['player_info']['player_id'], 0]} show_club={false} hidden={false}/>
              {currentGameIsDaily ? <button onClick={() => {shareGuessWhoResult(false)}}>Share Result ✉️</button> : ''}
              </div>
            </PerfectScrollbar>
          </div>,
          confirmButtonText: "Back to Main Menu!",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: true,
          showCloseButton: false,
          showCancelButton: false,
        }).then((result) => {
  
          if (result.isConfirmed) {
            resetGame()
            showMenu()
          }
        })
      }
    }
    
    setGuessWhoGuessMatrix([...guessWhoGuessMatrix, player])
    setClearGuessWhoField(true)
    setSelectedGuessWhoPlayer(undefined)
  }

  const makeEmptyGuessWhoGuess = () => {
    makeGuessWhoGuess("empty_guess")
    setHintCount(hintCount+1)
  }

  const makeKitClashGuess = (guess, year) => {
    setKitClashGuesses([...kitClashGuesses, [guess, year]])
    // first 2 letters of guess['kit_url']
    console.log(guess[1] ,  kitClashAnswer['year'] , guess[0] , kitClashAnswer['club'])

    if(guess ==  kitClashAnswer['club']  && year == kitClashAnswer['year']){
      // Show swal saying you wan
      MySwal.fire({
        title: "You win!",
        position:'top'
      })
    }
    setClearKitField(true)
    setSelectedKitClashPlayer(undefined)
  }

  const guessCount = () => guessWhoGuessMatrix.length

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
      {
        currentGameIsHigherLower ?
        <div style ={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        Current streak: {currentStreak} <br></br>

        <HigherLowerRenderer leftAttacker={leftAttacker} rightAttacker={rightAttacker} statistic={statistic} selectedFunction={checkHigherLower} lost={!gameActive} smallMode={false}/>
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

{
        currentGameIsKitClash ?
        <div style ={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <p>Kit Clash</p>
          <div className="kit_top_half">
            <div>
              <KitSearchBar names = {club_names} answer={kitClashAnswer} setSelectedClub={setSelectedKitClashPlayer} clearField={clearKitField} updateClearField={setClearKitField}/>
              <KitCurrentClubViewer selectedPlayer={selectedKitClashPlayer} onclick={undefined} submitPlayer={makeKitClashGuess} setPlayerMatches={undefined} ></KitCurrentClubViewer>
            </div>
            <KitClashRenderer answer={kitClashAnswer} guessCount={kitClashGuesses.length}></KitClashRenderer>
          </div>
          <KitGuesses guesses={kitClashGuesses} answer={kitClashAnswer}/>

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

      {
        currentGameIsGuessWho ?
        <div style ={{display:'flex', flexDirection:'column', alignItems:'center', maxHeight:'75vh', overflowY:'scroll'}}>
        <GuessWhoSearchBar clearField={clearGuessWhoField} updateClearField={setClearGuessWhoField} gameActive={true} selectPlayerFunction={setSelectedGuessWhoPlayer} setSelectedPlayer={setSelectedGuessWhoPlayer} giveClueFunction={makeEmptyGuessWhoGuess} hintCount={hintCount} guessCount={guessCount}></GuessWhoSearchBar>
        <GuessWhoCurrentPlayerViewer selectedPlayer={selectedGuessWhoPlayer} onclick={undefined} submitPlayer={makeGuessWhoGuess} setPlayerMatches={undefined}/>
        <GuessWhoRenderer guess_answer={guessWhoAnswer} guess_count={guessCount} hint_count={hintCount} guess_matrix={guessWhoGuessMatrix}></GuessWhoRenderer>
        
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

      {
        currentGameModeIsTTY ?
        <div style ={{display:'flex', flexDirection:'column', alignItems:'center', maxHeight:'75vh', overflowY:'scroll'}}>
        <ThroughTheYearsRenderer answer={ttyAnswer} won={tty_game_end} toast_f={toast}/>
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

      {
        currentGameModeIsHLF ?
        <div style ={{display:'flex', flexDirection:'column', alignItems:'center', maxHeight:'75vh', overflowY:'scroll'}}>
        <HigherLowerFifaRenderer currentGameIsDaily={currentGameIsDaily} dailySeed={getTodayRandom} showMenu={showMenu}/>
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
          if(currentGameIsHigherLower || currentGameIsGuessWho || currentGameIsKitClash || currentGameModeIsTTY || currentGameModeIsHLF){
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
                <>
                <center><span>Footdle Icons</span></center>
                <IconSearchBar players={icons} selectPlayerFunction={setSelectedPlayer} clearField={clearField} updateClearField={updateClearField} gameActive={gameActive} setSelectedPlayer={setSelectedPlayer}/>
                </>
                  
                    : <>
                      
                      <center><span>Footdle</span></center>
                      <SearchBar players={other_players} selectPlayerFunction={setSelectedPlayer} clearField={clearField} updateClearField={updateClearField} gameActive={gameActive} setSelectedPlayer={setSelectedPlayer}/>
                    </>
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
                      limit={1}
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
