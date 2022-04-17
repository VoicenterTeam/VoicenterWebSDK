const VoicenterWebSDK = require("./index")
const vcSDK = new VoicenterWebSDK({host:'0.0.0.0',port:3000});
vcSDK.start()