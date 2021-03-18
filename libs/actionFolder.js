const logicFoldersByName = {};
const logicFolderList = ['cdrLogicFolder', 'callLogicFolder', 'popupLogicFolder'];

// Get paths for all logic folders 
// for (let folderName of logicFolderList) {
//   logicFoldersByName[folderName] = global.config[folderName] ? __dirname + "/../../../" + global.config[folderName] : __dirname + "/../../../";
// }

logicFoldersByName.cdrLogicFolder = global.config.cdrLogicFolder ? __dirname + "/../../../" + global.config.cdrLogicFolder : __dirname + "/../../../";
logicFoldersByName.callLogicFolder = global.config.callLogicFolder ? __dirname + "/../../../" + global.config.callLogicFolder : __dirname + "/../../../";
logicFoldersByName.popupLogicFolder = global.config.popupLogicFolder ? __dirname + "/../../../" + global.config.popupLogicFolder : __dirname + "/../../../";

module.exports = logicFoldersByName;