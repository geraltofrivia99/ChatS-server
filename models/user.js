import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user', {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: 'The username can only contain letters and num',
          },
          len: {
            args: [3, 25],
            msg: 'The username needs to be between 3 and 25 char',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Invalid Email',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [5, 12],
            msg: 'The password needs to be between 5 and 12 char',
          },
        },
      },
    },
    {
      hooks: {
        afterValidate: async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          // eslint-disable-next-line no-param-reassign
          user.password = hashedPassword;
          // return {
          //   ...user,
          //   password: hashedPassword,
          // };
        },
      },
    },
  );

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return User;
};
