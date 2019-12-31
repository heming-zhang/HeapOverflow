'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Vote.associate = function(models) {
    // associations can be defined here
    Vote.belongsTo(models.User, {
      onDelete: 'CASCADE'
    });
    Vote.belongsTo(models.Question, {
      onDelete: 'CASCADE'
    });
    Vote.belongsTo(models.Comment, {
      onDelete: 'CASCADE'
    });
  };
  return Vote;
};