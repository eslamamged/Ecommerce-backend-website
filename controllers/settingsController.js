const settings = require('../models/Settings');
const factory = require('./handlerFactory');



exports.getAll = factory.getAll(settings);
exports.updateSetting = factory.updateOne(settings);
