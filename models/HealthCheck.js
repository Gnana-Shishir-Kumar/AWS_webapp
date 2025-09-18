const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HealthCheck = sequelize.define('HealthCheck', {
  check_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  check_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      // Always return UTC timestamp
      const rawValue = this.getDataValue('check_datetime');
      return rawValue ? rawValue.toISOString() : null;
    }
  }
}, {
  tableName: 'health_checks',
  timestamps: false, // We're managing timestamps manually
  underscored: true, // Use snake_case column names
  indexes: [
    {
      fields: ['check_datetime']
    }
  ]
});

module.exports = HealthCheck;