//working - not using

import { useEffect, useState } from "react"

export function Game(){
    const [boardState, setBoardState] = useState(Array(9).fill(null))
    const [count, setCount] = useState(0)
    const [color, setColor] = useState(Array(9).fill(''))
    const [user, setUser] = useState("X")
    const [winner, setWinner] = useState(null)
    const [history, sethistory] = useState([])
    const [redo, setRedo] = useState([])

    function clickHandler(index){
        if(boardState[index] == null && winner == null){
            sethistory(prev => [...prev, [...boardState]])
            let board = [...boardState];
            board[index] = user;
            setBoardState(board);
            setRedo(prev => [[...board]])
            setCount(c => c+1);
            setUser(prevUser => prevUser == "X" ? "O" : "X")
            clickColor(index)
        }
    }

    function reset(){
        setBoardState(Array(9).fill(null))
        setUser("X")
        setColor(Array(9).fill(''))
        setCount(0)
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
                console.log("winner")
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
        console.log(color)
    }

    function changeUser(e){
        reset();
        setUser(prevUser => e.target.value)
    }

    function historyHandler(){
        if(history.length && winner == null){
            setBoardState(prev => history[history.length -1])
            setRedo(prev => [...prev, [...history[history.length -1]]] )
            sethistory(history.slice(0, -1))
            setCount(c => c-1)
            setUser(prevUser => prevUser == "X" ? "O" : "X")
        }
    }
    console.log("history : ")
    console.log(history)
    console.log("redo : ")
    console.log(redo)
    console.log(count)

    function redoHandler(){
        if(redo.length > 1){
            setBoardState(prev => redo[redo.length-2])
            sethistory(prev => [...prev, [...boardState]])
            setRedo(redo.slice(0, -1))
            setCount(c => c+1)
            setUser(prevUser => prevUser == "X" ? "O" : "X")
        }
    }

    return(
        <>
        <button onClick={changeUser} value={"X"}>player X</button>
        <button onClick={changeUser} value={"O"}>player 0</button>
        {winner && <h2>winner is :{winner}</h2>}
        {winner == null && count == 9 && <h2>Game Draw</h2>}
        <span className="parent">
        {boardState.map((box, index) => <Square key={index} box={box} className={color[index]} onClick={() => clickHandler(index)} />)}
        </span>
        <button onClick={redoHandler}>redo</button>
        <button onClick={reset}>reset</button>
        {count > 0 && <button onClick={historyHandler}>undo</button>}

        </>
    )
}


function Square({box,className, onClick}){

    return(
        <button className={className} onClick={onClick}>{box}</button>
    )
}