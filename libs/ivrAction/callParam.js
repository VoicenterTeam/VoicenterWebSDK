module.exports = class CallCustomParam {
    constructor(paramName,paramValue,isUpdated){
        this.Name=""
        this.Value =""
        this.IsUpdated=true
        if(paramName.constructor.name=="Object" && paramName.Name&& paramName.Name.length>0 ){
            this.Name=paramName.Name
            this.SetParamValue(paramName.Value)
            if(paramName.IsUpdated===false)this.IsUpdated=false
        }else if (paramName.constructor.name=="String") {
            this.Name=paramName
            this.SetParamValue(paramValue)
            if(isUpdated===false)this.IsUpdated=false
        }
    }
    SetParamValue(val){
        let valStr =""
        if(val.constructor.name=="Object" ||val.constructor.name=="Array"){
            valStr=JSON.stringify(val)
        }else if(val.constructor.name=="String" ) {
            valStr=val
        }else{
            console.error("Failed to set value to call parameter ",this)
        }
        if(valStr.length<0){
            console.error("parameter value is empty",this)
        }else if(valStr.length>128){
            console.error("parameter value is to big ... cant be more than 128 characters ",this)
        }else{
            this.Value=valStr
        }
    }
    Update(val){
        this.SetParamValue(val)
        this.IsUpdated=true
    }


}