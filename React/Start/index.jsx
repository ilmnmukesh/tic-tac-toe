let oldServerId=""
const Start=({page, setPage, setMode, setCpuMode, setFriendPlay, serverId, setServerId, setPlayerType,setMsgCreated})=>{
    const [start, setStart]=React.useState(true)
    const [playFriends, setPlayFriends]=React.useState(false)
    const [joinCreate, setJoinCreate]=React.useState(false)
    const [generateLoading, setGenerateLoading]= React.useState(false)
    const [connectLoading, setConnectLoading]=React.useState(false)
    const [code, setCode]=React.useState("")
    const [err, setErr]=React.useState("")
    const enableStart=()=>{
        setStart(!start)
        setPlayFriends(false)
    }
    const enablePlayFriends=()=>{
        setStart(false)
        setPlayFriends(!playFriends)
    }
    const enablePlayBack=()=>{
        setCpuMode(false)
        setPage(!page)        
    }
    const enableMode =(type)=>{
            setPage(!page);
            let m= {
                "easy":false,
                "medium":false,
                "hard":false
            };
            m[type]=true
            setCpuMode(true)
            setMode({...m})
    }
    const generate =()=>{
        setGenerateLoading(true)
        let db=firebase.database()
        let code=Math.floor(Math.random()*90000) + 10000
        db.ref(code.toString()).set({"user_created":"created"})
        db.ref(code.toString()).on("child_added", (e)=>{
            if(e.val()=="connect"){
                setFriendPlay(false) 
            }
        })
        setPlayerType("player1")
        setServerId(code.toString())
    }
    const connectServer=()=>{
        setErr("")
        if(code==null&& code==""){
            return
        }
        setConnectLoading(true)
        if(code.length!=5){
            setErr("Code must 5 character")
            setConnectLoading(false)
            return
        }
        let db=firebase.database()
        db.ref(code).once("value",(s)=>{
            let a=s.val()
            let player="player2"
            if(a!=null && a!==undefined && a.msg !== undefined && a.msg.player1 !== undefined && a.msg.player1.code=="back"){
                player="player1"
            }
            if(s.exists()){
                db.ref(code.toString()+"/msg").once("value", (e)=>{
                    let con=true
                    let msg = e.val()
                    if(e.val()!=null && e.val().player1 !=null && e.val().player1.code!=undefined ){
                        if(e.val().player1.code=="connect" && e.val().player2.code=="connect"){
                            con=false
                        }
                        else if(msg.player1.code=="back"){
                            msg["player1"].code="connect"
                        }else if(msg.player2.code=="back"){
                            msg["player2"].code="connect"
                        }
                        
                    }else{
                        msg={
                            "player1":{"code":'connect'},
                            "player2":{"code":'connect'}
                        }
                    }
                    
                    if(con){
                        db.ref(code.toString()+"/data/match").once("value", (e)=>{
                            let match=""
                            if(e.val()!=null){
                                match=e.val()
                            }       
                            db.ref(code.toString()+"/status/player").once("value", (f)=>{
                                let playType="player2"
                                if(f.val()!=null){
                                   playType=f.val()
                                }
                                db.ref(code.toString()).set({
                                    "user_connect":"connect",
                                    "restart":{"playerType":false},
                                    "data":{"match":match}, 
                                    "msg":msg,
                                    "status":{"player":playType}
                                })
                            })
                        })
                        if(oldServerId!=code.toString()){
                            setMsgCreated(true)
                        }else{
                            setMsgCreated(false)
                        }
                        setServerId(code.toString())
                        setPlayerType(player)
                        setFriendPlay(false) 
                    }else{
                        setErr("Room Full")
                        setConnectLoading(false)
                    }
                })
            }else{
                setErr("Invalid Code")
                setConnectLoading(false)
            }
        })
    }
    React.useEffect(()=>{
        oldServerId=serverId
        setServerId("")
        $(".toast").toast("show")
    }, [])
    return (
        <div className="text-center pt-sm-3">
            <div className="pt-5">
                <div className="pt-5" >
                    <button onClick={enableStart} className={`btn btn-md ${start?"btn-outline-purple":"btn-purple" }`}>Start</button>
                    <button onClick={enablePlayFriends} className={`btn btn-md ${playFriends?"btn-outline-purple":"btn-purple" }`}>Play with Friends</button>
                    <button onClick={enablePlayBack} className="btn btn-md btn-purple">Plays N Back</button>
                </div>
            </div>
            <div className={start?"":"d-none"}>
                <div className="pt-5" >
                    <button onClick={()=>enableMode("easy")} className="btn btn-md btn-success">Easy</button>
                </div>
                <div className="pt-2" >
                    <button onClick={()=>enableMode("medium")} className="btn btn-md btn-warning">Medium</button>
                </div>
                <div className="pt-2" >
                    <button onClick={()=>enableMode("medium")} className="btn btn-md btn-danger">Hard</button>
                </div>
            </div>
            <div className={playFriends?"":"d-none"}>
                <div className="pt-5" >
                    <button onClick={()=>setJoinCreate(!joinCreate)}
                        className={`btn btn-md ${joinCreate?"btn-success":"btn-outline-success" }`}
                    >Join</button>
                    <button onClick={()=>setJoinCreate(!joinCreate)} 
                        className={`btn btn-md ${joinCreate?"btn-outline-warning":"btn-warning" }`}
                    >Create</button>
                </div>
                <div className={!joinCreate?"pt-5 container col-8 col-md-4 col-lg-3":"d-none"} style={{fontFamily:"'Source Code Pro', monospace"}}>
                    <div class="md-form text-center m-0">
                        <input class="form-control" maxLength={5} onKeyDown={(e)=>{
                            if(e.key=="Enter"){
                                connectServer()
                            }
                        }} onChange={e=>setCode(e.target.value)} name="code" type="text" required/>
                        <label class="text-center border-0">Enter Code</label>
                        <small class="text-danger">
                            {
                                connectLoading
                                ?
                                <div class="spinner-border text-secondary" role="status" style={{width:25, height:25}}>
                                    <span class="visually-hidden"></span>
                                </div>
                                :
                                err
                            }
                        </small>
                    </div>
                    <div class="mt-md-5">
                        <button onClick={connectServer} type="submit" class="btn-rounded btn btn-outline-grey btn-block my-4 waves-effect">Connect</button>
                    </div>
                </div>
                <div className={joinCreate?"pt-5 container col-8 col-md-4 col-lg-3":"d-none"} style={{fontFamily:"'Source Code Pro', monospace"}}>
                    <div class="text-center">
                        <p class="col-12">{serverId}</p>
                        <button disabled={serverId!=""}
                        onClick={generate} class="btn-rounded btn btn-outline-grey btn-block my-4 waves-effect">Generate</button>
                    </div>
                    {
                        generateLoading
                        ?
                        <div className="text-center">
                            <h6 className="mb-3">Wait for opponent</h6>
                            <div class="spinner-border text-secondary" role="status">
                                <span class="visually-hidden"></span>
                            </div>
                        </div>
                        :
                        <div></div>
                    }
                </div>
            </div>
            
            
        </div>
        
    )   
}