const PlayBack=({page, setPage, setTotalSeconds})=>{
    const [elements, setElements]=React.useState([])
    const [currentState,setCurrentState ]= React.useState(true)
    const [win, setWin]= React.useState(false)
    const [status, setStatus]=React.useState({"win":0, "loss":0, "tie":0, "msg":null})
    const createXO=(pos)=>{
        let el=elements[pos];
        let retEle= (<div></div>)
        if(el!==undefined && el.click){
            if(el.X){
                retEle=(<XContainer/>)
            }else{
                retEle=(<OContainer/>)
            }
        }
        return retEle
    }
    const createXOat =(pos, cpu=true)=>{
        if(win){
            return
        }
        let data= [...elements];
        let el = data[pos]     
        if (!el.click){
            el.click=true
            if(currentState){
                el.X=true
            }    
            setCurrentState(!currentState)    
        }       
        setElements([...data])
        let checkwin=checkWin()
        let checkTie=elements.map(e=>e.click)
        let check =true
        for(let x=0;x<checkTie.length;x++){
            if(!checkTie[x]) check=false
        }
        if(!checkwin && check){
            setWin(true)
            status["tie"]+=1
            status["msg"]="Last match tie"
            setStatus({...status})
        }
    }   
    const restart =()=>{
        let el=[] 
        for(let x=0;x<9;x++){
            el.push({"click":false, "X":false})
        }
        setElements([...el])
        setWin(false)
        setTotalSeconds(0)
    }
    const updateWin=(winner)=>{
        if(winner){
            status["win"]+=1
            status["msg"]="Last match win"
        }else{
            status["loss"]+=1
            status["msg"]="Last match loss"
        }
    }
    const checkWin=()=>{
        let el= [...elements];
        let check=false
        let winner=false
        if(el.length==9){
            [check, winner]=checkPos0(el)
            if(check){
                setWin(true)
                updateWin(winner)
                return true
            }
            [check, winner]=checkPos4(el)
            if(check){
                setWin(true)
                updateWin(winner)
                return true
            }
            [check, winner]=checkPos8(el)
            if(check){
                setWin(true)
                updateWin(winner)
                return true
            }
        }
        return false
    }
    React.useEffect(()=>{
        let el=[] 
        for(let x=0;x<9;x++){
            el.push({"click":false, "X":false})
        }
        setElements([...el])
    }, [])

    return (
        <div>
            <div className="pt-3">
            </div>
            <div className="row tic-border" style={{margin:"auto auto"}}>
                <div
                    onClick={()=>{createXOat(0)}}
                    className="col-4 tic-border-nested text-center border-bottom border-right border-dark"
                >
                    {createXO(0)}
                </div>
                <div 
                    onClick={()=>{createXOat(1)}}
                    className="col-4 tic-border-nested border border-top-0 border-dark">
                    {createXO(1)}
                </div>
                <div 
                    onClick={()=>{createXOat(2)}}
                    className="col-4 tic-border-nested border-left border-bottom border-dark">
                    {createXO(2)}
                </div>
                <div 
                    onClick={()=>{createXOat(3)}}
                    className="col-4 tic-border-nested border border-left-0 border-dark">
                    {createXO(3)}
                </div>
                <div 
                    onClick={()=>{createXOat(4)}}
                    className="col-4 tic-border-nested border border-dark">
                    {createXO(4)}
                </div>
                <div 
                    onClick={()=>{createXOat(5)}}
                    className="col-4 tic-border-nested border border-right-0 border-dark">
                    {createXO(5)}
                </div>
                <div 
                    onClick={()=>{createXOat(6)}}
                    className="col-4 tic-border-nested border-right border-top border-dark">
                    {createXO(6)}
                </div>
                <div 
                    onClick={()=>{createXOat(7)}}
                    className="col-4 tic-border-nested border border-bottom-0 border-dark">
                    {createXO(7)}
                </div>
                <div 
                    onClick={()=>{createXOat(8)}}
                    className="col-4 tic-border-nested border-left border-top border-dark">
                    {createXO(8)}
                </div>
            </div>
            
            <div class="text-center d-sm-flex d-none d-sm-block " style={{fontFamily:"'Source Code Pro', monospace"}}>    
                <div className="col-4">
                    Player 1:<span className="badge badge-info">{status.win}</span>&emsp;
                    Tie:<span className="badge badge-warning">{status.tie}</span>&emsp;
                    Player 2:<span className="badge badge-danger">{status.loss}</span>
                    <div class="text-center pt-3">
                        <button onClick={()=>setPage(!page)} className="btn btn-md btn-danger">Back</button>
                        {win
                        ?<button onClick={restart} className="btn btn-md btn-danger">Restart</button>
                        :(<div></div>)
                        }
                    </div>
                </div>
                <div className="col-4">
                    {status.msg==null?"":status.msg}
                </div >
                <div className="text-center col-4">
                    Current Player:{currentState?<XContainer/>:<OContainer/>}
                </div>             
                
            </div>

            <div class="text-center pt-3 d-block d-sm-none">
                <button onClick={()=>setPage(!page)} className="btn btn-md btn-danger">Back</button>
                {win
                ?<button onClick={restart} className="btn btn-md btn-danger">Restart</button>
                :(<div></div>)
                }
            </div>
            <div class="text-center d-block d-sm-none" style={{fontFamily:"'Source Code Pro', monospace"}}>    
                <div>
                    Player 1:<span className="badge badge-info">{status.win}</span>&emsp;
                    Tie:<span className="badge badge-warning">{status.tie}</span>&emsp;
                    Player 2:<span className="badge badge-danger">{status.loss}</span>
                </div>
                <div>
                    {status.msg==null?"":status.msg}
                </div>
                <div className="text-center d-block d-sm-none">
                    Current Player:{currentState?<XContainer/>:<OContainer/>}
                </div>
                
            </div>
        </div>
        
    )
}