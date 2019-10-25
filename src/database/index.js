import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/user';
import File from '../app/models/file';
import Appointment from '../app/models/appointment';

const models = [
    User,
    File,
    Appointment,
];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        models
            .map((model) => model.init(this.connection))
            .map((model) => model.associate && model.associate(this.connection.models));
    }

    mongo() {
        this.mongoConnection = mongoose.connect('mongodb://192.168.99.100:27017/gobarber', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, (err) => console.log(err ? err.message : 'Mongo connection estabilshed successfully!'));
    }
}

export default new Database();
