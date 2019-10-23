
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('appointments', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            references: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: false,
        },
        provider_id: {
            type: Sequelize.INTEGER,
            references: { model: 'users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: false,
        },
        canceled_at: {
            type: Sequelize.DATE,
            allowNull: true,
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

    down: (queryInterface, Sequelize) => queryInterface.dropTable('appointments'),
};
