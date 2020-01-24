module.exports = class DialAction {
    constructor(dialData) {

       this.output = {
           "STATUS": 0,
           "ACTION": "DIAL",
           "NEXT_VO_ID": 2,
           "DATA": [ ]
       }

        if(dialData&&dialData.sayData){
            if (dialData.NextLayer) {
                this.output.NEXT_VO_ID=dialData.NextLayer
            }
            dialData=dialData.sayData;
        }
       let that =this

        if(dialData&&dialData.constructor.name=="Object"){
          //
       }else if(dialData&&dialData.constructor.name=="String"){
          //

       }
    }

    GetOutput(){
       // this.output.DATA = this.SayList
        return this.output
    }
}