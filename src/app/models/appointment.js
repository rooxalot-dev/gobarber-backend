import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
    static init(sequelize) {
        super.init({
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
            canceled_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        }, { sequelize });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
        this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'Provider' });
    }
}

export default Appointment;
