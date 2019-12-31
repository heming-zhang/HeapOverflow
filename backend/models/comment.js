'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'answer cannot be empty'
        } 
      }
    }
  }, {});
  Comment.associate = function(models) {
    Comment.belongsTo(models.User, {
        onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.Question, {
        onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.Comment, {
        as: 'parent',
        foreignKey: 'ParentId',
        onDelete: 'CASCADE'
    });
    Comment.hasMany(models.Vote, {
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};