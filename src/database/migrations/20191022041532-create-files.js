
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('files', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        path: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            default: new Date(),
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            default: new Date(),
        },
    }),

    down: (queryInterface, Sequelize) => queryInterface.dropTable('files'),
};
