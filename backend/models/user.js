'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'username cannot be empty'
        } 
      }
    },
    passwd: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'password cannot be empty'
        }
      }
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Question, {
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Comment, {
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Vote, {
      onDelete: 'CASCADE'
    });
  };
  return User;
}