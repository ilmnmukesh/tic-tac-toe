const Timer=({totalSeconds, setTotalSeconds})=>{
    const [min, setMin]=React.useState("00")
    const [sec, setSec]=React.useState("00")

    const convertString=(val)=>{
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }

    React.useEffect(()=>{
        setTotalSeconds(0);
        const timer = window.setInterval(() => {
            setTotalSeconds(e=> e+1)
        }, 1000);
        return () => {
            window.clearInterval(timer);
        };
    }, [])

    React.useEffect(()=>{
        setSec(convertString(totalSeconds % 60))
        setMin(convertString(parseInt(totalSeconds / 60)))
    }, [totalSeconds])
    return (
        <div  className="h6 text-center pt-3"  style={{fontFamily:"'Source Code Pro', monospace"}}>
            {min}:{sec}
        </div>
    )
}