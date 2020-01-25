module.exports = class SayAction {
    constructor(sayData) {
//{sayData:[{"Number" : "113"}},NextLayer:13 ,Language :"EN" }
       this.output = {
           "STATUS": 0,
           "ACTION": "SAY_DIGITS",
           "NEXT_LAYER": 0,
           "NEXT_LAYER_IF_FAILED": 1,
           "LANGUAGE": "EN",
           "DATA": [ ]
       }
       this.SayList = []
        if(sayData&&sayData.sayData){
            if (sayData.NextLayer) {
                this.output.NEXT_LAYER=sayData.NextLayer
            }
            sayData=sayData.sayData;
        }
       let that =this
       if(sayData&&sayData.constructor.name=="Array"){
            sayData.forEach(function (sayAction) {

              if(sayAction.constructor.name=="Object"){
                  that.AddSayAction({RecordType: Object.keys(sayAction)[0],Content:sayAction[Object.keys(sayAction)[0]]})
              }
            })
       }else if(sayData&&sayData.constructor.name=="Object"){
           that.AddSayAction({RecordType: Object.keys(sayData)[0],Content:sayData[Object.keys(sayData)[0]]})

       }else if(sayData&&sayData.constructor.name=="Number"){
           that.AddSayAction({RecordType: "Number",Content:sayData})

       }

       if(sayData&&sayData.Language)this.output.LANGUAGE=sayData.Language
    }
    AddSayAction(action){
        this.SayList.push(action)
    }
    GetOutput(){
        this.output.DATA = this.SayList
        return this.output
    }
}