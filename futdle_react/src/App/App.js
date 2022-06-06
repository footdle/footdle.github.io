import logo from '../logo.svg';
import './App.css';
import players from '../answers_temp.json';
import other_players from '../players_temp.json';
import SearchBar from '../SearchBar/SearchBar';
import CurrentPlayerViewer from '../CurrentPlayerView/CurrentPlayerViewer';
import HigherLowerRenderer from '../HigherLowerRenderer/HigherLowerRenderer';
import GuessMatrix from '../GuessMatrix/GuessMatrix';
import { useState, useEffect, useRef} from "react";
import CardRenderer from '../CardRenderer/CardRenderer';
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


function App() {
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
  const [currentGuess, setCurrentGuess] = useState({"pos":"??","lig":"??","lig_url":"??", "tim":"??","nat":"??","nam_long":"??", "nam":"??", "img": "https://cdn.sofifa.com/players/230/481/22_60.png", "tim_url":"??"})
  const [shareMatrix, setShareMatrix] = useState("")
  const [needsShare, setNeedsShare] = useState(false)
  const [gameActive, setGameActive] = useState(true)
  const [currentGameIsDaily, setCurrentGameIsDaily] = useState(false)
  const [needsOpponentGrid, setNeedsOpponentGrid] = useState(false)
  const [opponentLatest, setOpponentLatest] = useState([])

  const componentRef = useRef({});
  const { current: my } = componentRef;

  const limit = 12

  const resetGame = () => {
    setGameActive(true)
    setSelectedPlayer(undefined)
    updateGuesses([])
    setCurrentGuess({"pos":"??","lig":"??","lig_url":"??", "tim":"??","nat":"??", "nam_long":"??", "nam":"??", "img": "https://cdn.sofifa.com/players/230/481/22_60.png", "tim_url":"??"})

    let l = Math.floor(Math.random() * players.length);
    setAnswer(players[l])
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

    // (window.adsbygoogle = window.adsbygoogle || []).push({});

    // console.log(localStorage.getItem('streakData'))
    // console.log(dayOfYear())

    let guess = guesses[guesses.length-1]
    if(guesses.length >= limit && !matching(guess,answer)){
      setGameActive(false)

      if(currentGameIsDaily){
        // console.log('daily loss')
        my.current_streak = localStorage.getItem('streakData')
        if(my.current_streak !== null){
          // console.log('daily removed')
          localStorage.removeItem('streakData')
        }
      }

      MySwal.fire({
        title: <p>You lose.</p>,
        html: <div style={{    display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'}}>
            { currentGameIsDaily ? "Current Streak: 0 days":""}
            
            <CardRenderer guess={answer}/>
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
          MySwal.fire({
            toast:true,
            timer:3000,
            text:"Copied result to Clipboard!"      
          })
          
        }else if(value.isDismissed){

          // Reset the game
          setCurrentGameIsDaily(false)
          resetGame()
        }
  
      })
    }

    if(matching(guess,answer)){

      if(currentGameIsDaily){
        my.current_streak = localStorage.getItem('streakData')
        if(my.current_streak === null){
          let s = {
            "day":dayOfYear() + (new Date().getFullYear()),
            "streak":1
          }
          my.current_streak = s
          localStorage.setItem('streakData', JSON.stringify(s))
          // console.log('won, new streak')

        }else{
          let s = JSON.parse(localStorage.getItem('streakData'))
          // Check if lost streak
          // console.log('new day', dayOfYear(), (dayOfYear() + (new Date().getFullYear())))
          // console.log('old day', (s['day']))
          if((dayOfYear() + (new Date().getFullYear())) == (s['day'] + 1)){
            // console.log('new streak', s, (dayOfYear() + (new Date().getFullYear())))
            s['streak'] += 1
            s['day'] = (dayOfYear() + (new Date().getFullYear()))
            localStorage.setItem('streakData', JSON.stringify(s))
            my.current_streak = s
            // console.log('won, continue streak')
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
            {currentGameIsDaily ?  <span>Current Streak: {my.current_streak['streak'] + (my.current_streak['streak'] == 1 ? " day" : " days")}</span>:""}
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
        
        // const scriptTag = document.createElement("script");
        // scriptTag.src = "//upgulpinon.com/1?z=4912989";
        // scriptTag.async = true;
        // scriptTag.setAttribute("data-cfasync", "false")
        // document.body.appendChild(scriptTag);

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
          resetGame()
        }
  
        
      })
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
      confirmButtonText:"Ok!",
      allowEscapeKey:false,
      title:"Welcome to footdle",
      html:  <>
      <div style={{overflowY:'auto', fontSize:'small',  fontWeight:50}}>
      <p> Updates are coming soon!</p>

      
        <p>Now you will see a single advertisment. Thanks for the patience</p>
        <p> By  <a href="mailto:michael.pulis@outlook.com" target="_blank">Michael Pulis</a></p>
      </div>
      </>,
      showCancelButton: false,
      allowOutsideClick: false,
      
    }).then((value)=>{


      showAd()

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
        cancelButtonText: "Random Challenge",
        allowOutsideClick: false,
        
      }).then((value)=>{

        let random_gen_func = null;
        if(value.isConfirmed){
          random_gen_func = getTodayRandom
          setCurrentGameIsDaily(true)
        }else if(value.isDismissed){
          random_gen_func = Math.random
        }

        let l = Math.floor(random_gen_func() * players.length);
        setAnswer(players[l])
        // console.log(players[l])

      })
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
    let st = "Footdle " +dayOfYear()+" - "+ m +'/'+limit+'\n' + generateShareText()

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
      <center><h1>Footdle 
        </h1> 

      </center>
      
      <div className='outerHolder'>
        <div className='cardHolderOuter'>
        <CardRenderer guess={currentGuess}/>

        <span>{guesses.length}/{limit} attempts made</span>
        <GuessMatrix guesses = {guesses} answer={answer}/>

        </div>
        <div className='holder'>
          {/* <AdBanner/> */}
          <div>

          </div>
          <SearchBar players={other_players} selectPlayerFunction={setSelectedPlayer} clearField={clearField} updateClearField={updateClearField} gameActive={gameActive} setSelectedPlayer={setSelectedPlayer}/>
          <CurrentPlayerViewer selectedPlayer = {selectedPlayer} submitPlayer={makeGuess} onclick={undefined} setPlayerMatches={undefined}/>
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
  )
}

export default App;
