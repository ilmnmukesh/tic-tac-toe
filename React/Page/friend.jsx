const Friend=({friendPlay,setFriendPlay, serverId, setServerId,playerType, opponentType, msgCreated, setMsgCreated})=>{
    let db=firebase.database()
    const [elements, setElements]=React.useState([])
    const [currentState,setCurrentState ]= React.useState(true)
    const [win, setWin]= React.useState(false)
    const [wait, setWait]= React.useState(false)
    const [status, setStatus]=React.useState({"win":0, "loss":0, "tie":0, "msg":null})
    const [preventStatus, setPreventStatus]=React.useState(false)
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
    const createFriend= ()=>{
        db.ref(serverId+"/data/match").set(elements)
    }
    const createXOat =(pos)=>{
        if(win || wait){
            return
        }
        let data= [...elements];
        let el = data[pos]     
        if (!el.click){
            el.click=true
            if(currentState){
                el.X=true
            }    
            setElements([...data])
            createFriend()
            db.ref(serverId+"/status").set({"player":playerType})
            setWait(!wait)
            //setCurrentState(!currentState)    
        }       
        
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
            setPreventStatus(true)
        }
    }   
    const restart =()=>{
        let el=[] 
        for(let x=0;x<9;x++){
            el.push({"click":false, "X":false})
        }
        setElements([...el])
        db.ref(serverId+"/data/match").set(el)
        db.ref(serverId+"/restart").set({"playerType":true})
        setWin(false)
        setPreventStatus(false)
    }
    const updateWin=(winner)=>{
        if(preventStatus){
            return
        }
        if(winner && currentState){
            status["win"]+=1
            status["msg"]="Last match win"
        }else if(!winner && currentState){
            status["loss"]+=1
            status["msg"]="Last match loss"
        }else if(winner && !currentState){
            status["loss"]+=1
            status["msg"]="Last match loss"
        }
        else{
            status["win"]+=1
            status["msg"]="Last match win"
        }
        setPreventStatus(true)
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
    const goBack=()=>{
        let db= firebase.database()
        db.ref(serverId+"/msg/"+playerType).set({
            "code":'back'
        })
        setFriendPlay(!friendPlay);
    }
    const requestFriend=()=>{
        db.ref(serverId+"/msg").once("value", e=>{
            let data=e.val()
            if(data!=null){
                data[opponentType].code="back"
                db.ref(serverId+"/msg").set(data)
            }
        })
    }
    React.useEffect(()=>{
        //console.log(serverId,playerType, "o0",opponentType, msgCreated)
        let el=[] 
        for(let x=0;x<9;x++){
            el.push({"click":false, "X":false})
        }
        setElements([...el])
        if(playerType=="player2"){
            setCurrentState(false)
            setWait(true)
        }
        db.ref(serverId+"/data/match").once("value", (e)=>{
            if(e.val()!=null && e.val()!=""){
                setElements([...e.val()])
            }
        })
        db.ref(serverId+"/status/player").once("value", (e)=>{
            if(e.val()!=null){
                if(e.val()==playerType){
                    setWait(true)
                }else{
                    setWait(false)
                }
            }
        })
        db.ref(serverId+"/data").on("child_changed", (e)=>{
            if(e.val()!==undefined && e.val()!="" && e.val()!=null ){
                setElements([...e.val()])
                setWait(false)
            }                    
        })
        db.ref(serverId+"/restart").on("child_changed", (e)=>{
            if(e.val()==true){
                setWin(false)
                setPreventStatus(false)
                db.ref(serverId+"/restart").set({"playerType":false})
            }                    
        })
        if(msgCreated){
            db.ref(serverId+"/msg/"+opponentType).on("child_changed", (e)=>{
                if(e.val()=="back"){
                    $("#no-oppo").toast("show")
                }else if(e.val()=="connect"){
                    $("#oppo").toast("show")
                }
            })
            setMsgCreated(false)
        }
    }, [])   
    React.useEffect(()=>{
        if(!preventStatus){             
            let checkwin=checkWin()
            let checkTie=elements.map(e=>e.click)
            let check =true
            for(let x=0;x<checkTie.length;x++){
                if(!checkTie[x]) check=false
            }
            if(!checkwin && check && checkTie.length!==0){
                setWin(true)
                status["tie"]+=1
                status["msg"]="Last match tie"
                setStatus({...status})
                setPreventStatus(true)
            }
            
        }
    }, [wait])
    return (
        <div>
            <div className="pt-5">
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
            
            <div class="text-center d-sm-flex d-none d-sm-block" style={{fontFamily:"'Source Code Pro', monospace"}}>    
                <div className="col-4">
                    You :<span className="badge badge-info">{status.win}</span>&emsp;
                    Tie:<span className="badge badge-warning">{status.tie}</span>&emsp;
                    Opponent:<span className="badge badge-danger">{status.loss}</span>
                    <div class="text-center pt-3">
                        <button onClick={goBack} className="btn btn-md btn-danger">Back</button>
                        <button onClick={requestFriend} className="btn btn-md btn-danger">Request Other</button>
                        {win
                        ?<button onClick={restart} className="btn btn-md btn-danger">Restart</button>
                        :(<div></div>)
                        }
                    </div>
                </div>
                <div className="col-4 pt-4">
                    {status.msg==null?"":status.msg}
                    {
                            wait
                            ?
                                <div>wait.....</div>
                            :
                            <div></div>
                    }
                </div>
                <div className="text-center col-4">
                    Your Symbol:{currentState?<XContainer/>:<OContainer/>}
                </div>
                
            </div>

            <div class="text-center pt-3 d-block d-sm-none">
                <button onClick={goBack} className="btn btn-md btn-danger">Back</button>
                <button onClick={requestFriend} className="btn btn-md btn-danger">Request Other</button>
                {win
                ?<button onClick={restart} className="btn btn-md btn-danger">Restart</button>
                :(<div></div>)
                }
            </div>
            <div class="text-center d-block d-sm-none" style={{fontFamily:"'Source Code Pro', monospace"}}>    
                <div>
                    You :<span className="badge badge-info">{status.win}</span>&emsp;
                    Tie:<span className="badge badge-warning">{status.tie}</span>&emsp;
                    Opponent:<span className="badge badge-danger">{status.loss}</span>
                </div>
                <div>
                    {status.msg==null?"":status.msg}
                </div>
                <div className="text-center">
                    Your Symbol:{currentState?<XContainer/>:<OContainer/>}
                </div>
                {
                    wait
                    ?
                        <div>wait.....</div>
                    :
                    <div></div>
                }
                
            </div>
                
            <div role="alert" aria-live="assertive" aria-atomic="true" id="no-oppo" class="toast" data-delay="5000" data-autohide="true"
                style={{position:"absolute",bottom:"10%", right:"20%"}}
            >
                <div class="toast-body">
                    No opponent found
                </div>
            </div>

            
            <div role="alert" aria-live="assertive" aria-atomic="true" id="oppo" class="toast" data-delay="5000" data-autohide="true"
                style={{position:"absolute",bottom:"20%", right:"20%"}}
            >
                <div class="toast-body">
                    Opponent Connected
                </div>
            </div>
            
        </div>
        
        
    )
}