'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'title cannot be empty'
        } 
      }
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'description cannot be empty'
        } 
      }
    }
  }, {});
  Question.associate = function(models) {
    Question.belongsTo(models.User, {
      onDelete: 'CASCADE'
    });
    Question.hasMany(models.Comment, {
      onDelete: 'CASCADE'
    });
    Question.hasMany(models.Vote, {
      onDelete: 'CASCADE'
    });
  };
  return Question;
};