
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'avatar_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    }),

    down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'avatar_id'),
};
