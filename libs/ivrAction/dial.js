module.exports = class DialAction {
    constructor(target,dialOptions,call) {
        //("0523574321",{"Recording":true ,"Duration":1800,"Ring":60,NextVo:666,CallerID:"",CallerName,""})
        //(["0523574321"],{"Recording":true ,"Duration":1800,"Ring":60,NextVo:666,CallerID:"",CallerName,""})
        //([{"Target":"0523574321","Type":"PHONE"}],{"Recording":true ,"Duration":1800,"Ring":60,NextVo:666,CallerID:"",CallerName,""})
        this.output = {
           ACTION: "DIAL",
           CALLER_ID: "",
           CALLER_NAME: "",
           MAX_CALL_DURATION: 7200,
           MAX_DIAL_DURATION: 30,
           NEXT_VO_ID: 666,
           RECORDING: "yes",
           STATUS: 0,
           TARGETS: []
        };
        this.output.CALLER_ID = dialOptions.CallerID;
        this.output.NEXT_VO_ID = dialOptions.NextVo;
        this.output.MAX_CALL_DURATION=dialOptions.Duration;
        this.output.MAX_DIAL_DURATION=dialOptions.Ring;

        let that =this;
        //Target Parse
        if (target.constructor.name==="Object"||target.constructor.name==="String"){
            let targetObj = new DialTarget(target);
            if (targetObj.TARGET.length>0) this.output.TARGETS.push(targetObj)
        }else if (target.constructor.name==="Array"){
            target.forEach(function(targetData){
                let targetObj = new DialTarget(targetData);
                if (targetObj.TARGET.length>0) that.output.TARGETS.push(targetObj)
            })
        }
        //DialOptions Parse
        if(dialOptions&&dialOptions.constructor.name==="Object"){
            let dailOptionsObj = new DialOptions(dialOptions,call);
            this.loadDialOptions(dailOptionsObj);
        }

    }

    GetOutput(){
       // this.output.DATA = this.SayList
        return this.output
    }

    loadDialOptions(dialOptions) {
        this.Recording=dialOptions.Recording;
        this.CallerID=dialOptions.CallerID;
        this.CallerName=dialOptions.CallerName;
        this.MAX_CALL_DURATION=dialOptions.Duration;
        this.MAX_DIAL_DURATION=dialOptions.Ring;
        this.NextVo=dialOptions.NextVo;
    }
};

class DialTarget {
    constructor(target){
        this.TARGET ="";
        this.TYPE ="PHONE";
     if(target.constructor.name==="Object"){
         if(target.Target &&target.Target.constructor.name==="String" ) this.TARGET =target.Target;
         if(target.Type &&target.Type.constructor.name==="String") this.TYPE =target.Type;
     }else if(target.constructor.name==="String"){
         if(target.length>0 ) this.TARGET =target;
         this.TYPE ="PHONE";
     }
    }
}

class DialOptions {
    constructor(dialOptions,call){
        this.Recording = "Yes" ;
        this.Duration=7200 ;
        this.Ring=60 ;
        this.NextVo=666 ;
        this.CallerID="";
        this.CallerName="";
        //Recording
        if(
            dialOptions.Recording&&
            ( dialOptions.Recording===false ||
              (dialOptions.Recording.constructor.name==="String"&& dialOptions.Recording.toLowerCase()==="no")
            )
        ){
            dialOptions.Recording= "no";
        }else{
            dialOptions.Recording= "yes";
        }
        //Duration
        if(dialOptions.Duration&&dialOptions.Duration.constructor.name==="Number")this.Duration=dialOptions.Duration;
        //Ring
        if(dialOptions.Ring&&dialOptions.Ring.constructor.name==="Number")this.Ring=dialOptions.Ring;
        //NextVo
        if(dialOptions.NextVo&&dialOptions.NextVo.constructor.name==="Number")this.NextVo=dialOptions.NextVo;
        //CallerID
        if(dialOptions.CallerID&&dialOptions.CallerID.constructor.name==="String"){
            this.CallerID=dialOptions.CallerID;
        }else{
           if(call&&call.CallerID&&call.CallerID.constructor.name==="String") this.CallerID=call.CallerID;
        }
        //CallerName
        if(dialOptions.CallerName&&dialOptions.CallerName.constructor.name==="String"){
            this.CallerName=dialOptions.CallerName;
        }

    }
}
