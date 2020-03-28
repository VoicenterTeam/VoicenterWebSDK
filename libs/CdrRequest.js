let cdrLogicFolder = __dirname+"/../../../";
if(global.config.cdrLogicFolder)cdrLogicFolder= __dirname+"/../../../"+global.config.cdrLogicFolder;
console.log("Loading CallRequest Class , Call Logic folder is :",cdrLogicFolder);
const clear = require("clear-module");

module.exports = class CdrRequest {
    constructor(request,reply) {

        this.request = request;
        this.reply = reply;
        this.cdrLogic = null;
        this.done = false;
        // Main Request Cdr  Vars
        this.caller = null;
        this.target = null;
        this.time = null;
        this.duration = "";
        this.ivruniqueid = null;
        this.type = null;
        this.status =null;
        this.targetextension = null;
        this.callerextension = null;
        this.did = null;
        this.queueid = null;
        this.queuename = null;
        this.record = null;
        this.price = null;
        this.dialtime = null;
        this.representative_name = null;
        this.representative_code = null;
        this.targetextension_name = null;
        this.callerextension_name = null;
        this.target_country = null;
        this.caller_country = null;
        this.IVR  = [];
        this.ResponseOkData ={"err":0,"errdesc":"OK"};

    }
    async ParseRequest(){
        try {
            if( this.request.params.CdrLogic && (request.query.reload||request.query.Reload)){
            clear(cdrLogicFolder+'/'+request.params.CdrLogic )
            }
        }catch (e) {
            console.error("MODULE reload failed  "+   this.request.params.CdrLogic  ,e)
        }
        try{
            this.callLogic = require( cdrLogicFolder+'/'+this.request.params.CdrLogic  );
        }catch( e ) {
            if ( e.code === 'MODULE_NOT_FOUND' ) {
                // The module hasn't been found
                console.error("MODULE_NOT_FOUND "+   this.request.params.CdrLogic  ,e)
            }
            console.error("MODULE load failed  "+   this.request.params.CdrLogic  ,e);
            console.error("Loading  "+__dirname+"../DefualtCallLogic");

            this.cdrLogic = require("../DefualtCdrLogic")
        }

        let that =this;
        try{
           if(this.request.body){
               if(this.request.body.caller)this.caller = this.request.body.caller;
               if(this.request.body.target)this.target = this.request.body.target;
               if(this.request.body.time)this.time = this.request.body.time;
               if(this.request.body.duration)this.duration = this.request.body.duration;
               if(this.request.body.ivruniqueid)this.ivruniqueid = this.request.body.ivruniqueid;
               if(this.request.body.type)this.type = this.request.body.type;
               if(this.request.body.status)this.status = this.request.body.status;
               if(this.request.body.targetextension)this.targetextension = this.request.body.targetextension;
               if(this.request.body.callerextension)this.callerextension = this.request.body.callerextension;
               if(this.request.body.did)this.did = this.request.body.did;
               if(this.request.body.queueid)this.queueid = this.request.body.queueid;
               if(this.request.body.queuename)this.queuename = this.request.body.queuename;
               if(this.request.body.record)this.record = this.request.body.record;
               if(this.request.body.price)this.price = this.request.body.price;
               if(this.request.body.dialtime)this.dialtime = this.request.body.dialtime;
               if(this.request.body.representative_name)this.representative_name = this.request.body.representative_name;
               if(this.request.body.representative_code)this.representative_code = this.request.body.representative_code;
               if(this.request.body.targetextension_name)this.targetextension_name = this.request.body.targetextension_name;
               if(this.request.body.callerextension_name)this.callerextension_name = this.request.body.callerextension_name;
               if(this.request.body.target_country)this.target_country = this.request.body.target_country;
               if(this.request.body.caller_country)this.caller_country = this.request.body.caller_country;
               if(this.request.body.IVR){
                   try{
                       let ivrArray = JSON.parse(this.request.body.IVR);
                       if(ivrArray.constructor.name==="Array")this.IVR = ivrArray;
                   }catch (e) {
                       console.error("Failed parse IVR list of cdr ",e);
                       console.error("IVR list",this.request.body.IVR);
                   }
               }

               //Parsing CUSTOM_DATA
               if(this.request.body.CUSTOM_DATA&&this.request.body.CUSTOM_DATA.constructor.name==="Object"){
                   Object.keys(this.request.body.DATA.CUSTOM_DATA).forEach(function (varName) {
                       try{
                           that.CustomDataParmList.push(new CallCustomParam(varName,that.request.body.DATA.CUSTOM_DATA[varName],false));
                       }catch (e) {
                           console.error("Failed adding CUSTOM_DATA parameter ",varName);
                       }
                   })
               }
           }
       }catch (e) {
           console.error("parseRequest failed ",e)
       }
    }
    Done(){
        this.done =true;
        this.reply.send(this.ResponseOkData);
    }
    async DoCdrLogic() {
        await this.cdrLogic(this);
        if(!this.done)this.Done()

    }
    // Call Custom Param Functions  Start
    SetParam(parmName,paramValue){
        let params = this.CustomDataParmList.filter(function (p) {return p.Name ===parmName });
        if(params.length>0){
            params.forEach(function (param) {
                param.Update(paramValue)
            })
        }else{
            this.CustomDataParmList.push(new CallCustomParam(parmName,paramValue,true));
        }

    }

    // Call Custom Param Functions  End
};
