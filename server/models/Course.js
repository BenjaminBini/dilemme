var mongoose = require('mongoose');

/**
 * Course schema
 */
var courseSchema = mongoose.Schema({
	name: {
		type:String, 
		required:'{PATH} is required'
	},
	featured: {
		type:Boolean, 
		required:'{PATH} is required'
	},
	published: {
		type: Date, 
		required:'{PATH} is required'
	},
	tags: {
		type: [String]
	}
});

/**
 * Course schema methods
 */
courseSchema.methods = {
}

var Course = mongoose.model('Course', courseSchema);

/**
 * Create default users in the db
 */
exports.createDefaultCourses = function() {
	Course.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
			Course.create({ name: 'C# for Sociotpaths', featured: true, published: new Date('1/1/2015'), tags: ['C#', '.NET'] });
			Course.create({ name: 'C# for non-Sociotpaths', featured: true, published: new Date('2/1/2015'), tags: ['C#', '.NET'] });
			Course.create({ name: 'Learn Java', featured: true, published: new Date('3/1/2015'), tags: ['Java'] });
			Course.create({ name: 'C for dummies', featured: true, published: new Date('4/1/2015'), tags: ['C']});
			Course.create({ name: '.NET made easy', featured: true, published: new Date('5/1/2015'), tags: ['C#', '.NET'] });
			Course.create({ name: 'C/C++', featured: false, published: new Date('6/1/2015'), tags: ['C', 'C++'] });
			Course.create({ name: 'Java for web developers', featured: true, published: new Date('7/1/2015'), tags: ['Java', 'Java EE'] });
			Course.create({ name: 'C', featured: false, published: new Date('8/1/2015'), tags: ['C'] });
			Course.create({ name: 'Build a dynamic website with PHP', featured: false, published: new Date('9/1/2015'), tags: ['C#', '.NET'] });
			Course.create({ name: 'Learn node.js', featured: false, published: new Date('10/1/2015'), tags: ['Javascript', 'node'] });
			Course.create({ name: 'The Javascript bible', featured: false, published: new Date('11/1/2015'), tags: ['Javascript', 'Browser'] });
		}
	});
};