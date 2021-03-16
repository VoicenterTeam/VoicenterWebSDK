let popupLogicFolder = __dirname+"/../../../";
if(global.config.popupLogicFolder)popupLogicFolder= __dirname+"/../../../"+global.config.popupLogicFolder;
console.log("Loading PopupRequest Class , popup Logic folder is :",popupLogicFolder);
const clear = require("clear-module");
const CallCustomParam = require("../libs/ivrAction/callParam");
const jwt = require('jsonwebtoken');

let keyConfig = {};
try {
    keyConfig = require(popupLogicFolder + '/' + 'keyConfig');
} catch(err) {
    console.log(err);
}

const jwtKey = keyConfig.jwtKey;

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
        this.status = null;
        this.approved = null;
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
           if(this.request.body  ){
               if(this.request.body.phone)this.phone = this.request.body.phone;
               if(this.request.body.ivrid)this.ivruniqueid = this.request.body.ivrid;
               if(this.request.body.extenUser)this.target = this.request.body.extenUser;
               if(this.request.body.did)this.did = this.request.body.did;
               if(this.request.body.statusCall)this.status = this.request.body.statusCall;
               if(this.request.body.approved)this.approved = this.request.body.approved;

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
           else if (this.request.query)
           {
               if(this.request.query.phone)this.phone = this.request.query.phone;
               if(this.request.query.ivrid)this.ivruniqueid = this.request.query.ivrid;
               if(this.request.query.extenUser)this.target = this.request.query.extenUser;
               if(this.request.query.did)this.did = this.request.query.did;
               if(this.request.query.statusCall)this.status = this.request.query.statusCall;
               if(this.request.query.approved)this.approved = this.request.query.approved;


               //Parsing CUSTOM_DATA
               if(this.request.query.CUSTOM_DATA&&this.request.query.CUSTOM_DATA.constructor.name==="Object"){
                   Object.keys(this.request.query.DATA.CUSTOM_DATA).forEach(function (varName) {
                       try{
                           that.CustomDataParmList.push(new CallCustomParam(varName,that.request.query.DATA.CUSTOM_DATA[varName],false));
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
    ApprovePopup(approveUrlPath) {
        this.done = true;
        const protocol = this.request.protocol || 'http://';
        const host = this.request.hostname;
        const popupPath = this.request.raw.originalUrl.split('?')[0];
        const query = { ...this, request: undefined, reply: undefined, Result: undefined, popupURL: protocol + host + popupPath };
        this.Result["URL"] = protocol + host + '/PopupApprove/' + approveUrlPath + '?&data=' + jwt.sign(query, jwtKey);
        this.reply.send(this.Result);
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
