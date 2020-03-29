let popupLogicFolder = __dirname+"/../../../";
if(global.config.popupLogicFolder)popupLogicFolder= __dirname+"/../../../"+global.config.popupLogicFolder;
console.log("Loading PopupRequest Class , popup Logic folder is :",popupLogicFolder);
const clear = require("clear-module");
const CallCustomParam = require("../libs/ivrAction/callParam");

module.exports = class PopupRequest {
    constructor(request,reply) {
        this.request = request;
        this.reply = reply;
        this.popupLogic = null;
        this.done = false;
        // Main Request Popup  Vars
        this.phone = null;
        this.target = null;
        this.ivruniqueid = null;
        this.did = null;
        this.queueid = null;
       // Set up Response Data
        this.Result ={} ;
        this.Result.STATUS="OK";
        this.Result.URL="";
        this.Result.CLIENTNAME="";
        this.Result.TOTAL=0;
        this.Result.COMPANY="";
        this.CustomDataParmList =[]
        }
    async ParseRequest(){
        try {
            if( this.request.params.PopupLogic && (this.request.query.reload||this.request.query.Reload)){
            clear(popupLogicFolder+'/'+this.request.params.PopupLogic )
            }
        }catch (e) {
            console.error("MODULE reload failed  "+   this.request.params.PopupLogic  ,e)
        }
        if(this.request.params.PopupLogic ){
            try{
                this.popupLogic = require( popupLogicFolder+'/'+this.request.params.PopupLogic  );
            }catch( e ) {
                if ( e.code === 'MODULE_NOT_FOUND' ) {
                    // The module hasn't been found
                    console.error("MODULE_NOT_FOUND "+   this.request.params.PopupLogic  ,e)
                }
                console.error("MODULE load failed  "+   this.request.params.PopupLogic  ,e);
                console.error("Loading  "+__dirname+"../DefualtCallLogic");

                this.popupLogic = require("../DefualtPopupLogic")
            }
        }else{
            this.popupLogic = require("../DefualtPopupLogic")
        }
        try{
           if(this.request.body){
               if(this.request.body.phone)this.phone = this.request.body.phone;

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
        this.reply.send(this.Result);
    }
    async DoPopupLogic() {
        await this.popupLogic(this);
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
