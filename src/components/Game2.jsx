import { useEffect, useState } from "react"

export function Game2(){
    const [boardState, setBoardState] = useState(Array(9).fill(null))
    const [color, setColor] = useState(Array(9).fill(''))
    const [user, setUser] = useState("X")
    const [winner, setWinner] = useState(null)
    const [history, sethistory] = useState([])
    const [redo, setRedo] = useState([])

    function clickOhandler(index){
        if(boardState[index] == null && winner == null){
            sethistory(prev => [...prev, {moveIndex : index ,board : [...boardState]}])
            let board = [...boardState];
            board[index] = user;
            setBoardState(board);
            setRedo(prev => [{moveIndex :index , board : [...board]}])
            setUser(prevUser => prevUser == "X" ? "O" : "X")
            clickColor(index)
        }
    }

    function clickHandler(index){
        if(user == 'X')
        clickOhandler(index)
    }

    function reset(){
        setBoardState(Array(9).fill(null))
        setUser("X")
        setColor(Array(9).fill(''))
        sethistory([])
        setRedo([])
        console.clear()
    }

    useEffect(() => {
        const value = gameWin()
        setWinner(value)
    },[boardState])

    function gameWin(){
        const winSet = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]

        for(let i=0; i<winSet.length;i++){
            const [a, b, c] = winSet[i];

            if(boardState[a] == boardState[b] && boardState[b] == boardState[c] && boardState[a] !=null){
                colorHandler(a, b, c)
                // console.log("winner")
                return boardState[a]
            }
        }
    }

    function clickColor(a){
        let colorSet = new Array(9).fill(null);
        colorSet[a] = 'prevColor';
        setColor(prev => colorSet)
    }

    function colorHandler(a, b, c){
        let colorSet = [...color];
        colorSet[a] = 'btnWin';
        colorSet[b] = 'btnWin';
        colorSet[c] = 'btnWin'

        setColor(prev => colorSet)
        // console.log(color)
    }

    function changeUser(e){
        reset();
        setUser(prevUser => e.target.value)
    }

    function historyHandler(){
        if(history.length && winner == null){
            let obj = history[history.length-1];
            setBoardState(prev => obj.board)
            if(history.length > 1){
                setRedo(prev => [...prev, {moveIndex: history[history.length-2].moveIndex , board :[...obj.board]}] )
                clickColor(history[history.length-2].moveIndex)
            }else{
                setRedo(prev => [...prev, {moveIndex: history[0].moveIndex.moveIndex , board :[...obj.board]}] )
                setColor(Array(9).fill(null))
            }
            sethistory(prev => history.slice(0, -1))
            setUser(prevUser => prevUser == "X" ? "O" : "X")
        }
    }

// upon re-rendering again with winner, the clearTimeout cancels previous timeout which leads to no execution of clickHandler
    useEffect(() =>{
        if(user == "O"){
            let arr = boardState.map((val ,index) =>(val === null ? index : null)).filter((x) => x!=null)
            let randNum = Math.floor(Math.random()*arr.length)
            const timeout = setTimeout(() => {
            if(!winner)
            clickOhandler(arr[randNum])
            }, 1000)

            return ()=>{clearTimeout(timeout)}
        }
    }, [user, winner])

    

    function redoHandler(){
        if(redo.length > 1){
            let obj = redo[redo.length-2];

            setBoardState(prev => obj.board)
            sethistory(prev => [...prev, {moveIndex : redo[redo.length-2].moveIndex ,board : [...redo[redo.length-1].board]}])
            setRedo(redo.slice(0, -1))
            setUser(prevUser => prevUser == "X" ? "O" : "X")
            clickColor(redo[redo.length-2].moveIndex)
        }
    }

    function isXUser(){
        if(user == "X"){
            return true
        }else{
            return false
        }
    }

    return(
        <>
        <button className={`${isXUser() ? "usercolor" : ""}`} onClick={changeUser} value={"X"}>Player X</button>
        <button className={`${isXUser() ? "" : "usercolor"}`} onClick={changeUser} value={"O"}>player 0</button>
        {winner && <h2>winner is :{winner}</h2>}
        {winner == null && history.length == 9 && <h2>Game Draw</h2>}
        <span className="parent">
        {boardState.map((box, index) => <Square key={index} box={box} className={color[index]} onClick={() => clickHandler(index)} />)}
        </span>
        {redo.length>0 && <button onClick={redoHandler}>redo</button>}
        <button onClick={reset}>reset</button>
        {history.length > 0 && <button onClick={historyHandler}>undo</button>}

        </>
    )
}


function Square({box,className, onClick}){

    return(
        <button className={className} onClick={onClick}>{box}</button>
    )
}