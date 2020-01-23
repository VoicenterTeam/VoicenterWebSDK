module.exports = class SayAction {
    constructor(sayData) {

       this.output = {
           "STATUS": 0,
           "ACTION": "SAY_DIGITS",
           "NEXT_LAYER": 2,
           "NEXT_LAYER_IF_FAILED": 1,
           "LANGUAGE": "EN",
           "DATA": [ ]
       }
       this.SayList = []
       let that =this
       if(sayData&&sayData.constructor.name=="Array"){
            sayData.forEach(function (sayAction) {

              if(sayAction.constructor.name=="Object")
                  that.AddSayAction({RecordType: Object.keys(sayAction)[0],Content:sayAction[Object.keys(sayAction)[0]]})
            })
       }
    }
    AddSayAction(action){
        this.SayList.push(action)
    }


    GetOutput(){
        this.output.DATA = this.SayList
        return this.output
    }
}