var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var foundSchema = new Schema({
	// name: {type: String, required: true}, // this version requires this field to exist
	// name: {type: String, unique: true}, // this version requires this field to be unique in the db		
	date: Date,
	tags: [String],
	story: String,
	url: String,
	location: {
		geo: { type: [Number], index: { type: '2dsphere', sparse: true } },
		name: String
	},	
	dateAdded : { type: Date, default: Date.now },
})

// export 'Animal' model so we can interact with it in other files
module.exports = mongoose.model('Found',foundSchema);