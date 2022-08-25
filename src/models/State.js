const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const modelSchema = new mongoose.Schema({
    name : String
});

const modelName = 'State';
if(mongoose.connect && mongoose.connection.models[modelName]){
    module.exports = mongoose,this.connection.models[modelName];
}else{
    module.exports = mongoose.model(modelName, modelSchema);
}