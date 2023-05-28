import { Sequelize } from "sequelize-typescript";
import { Check } from 'src/check/models/check.model';
import { UserVerificationCode } from 'src/user/models/user-verification-code.model';
import { User } from 'src/user/models/user.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        define: {
          timestamps: false
        },
      });
      sequelize.addModels([User, UserVerificationCode, Check]);

      sequelize.authenticate()
        .then(() => {
          console.log('Connection has been established successfully ✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔');
        })
        .catch(err => {
          console.error('Unable to connect to the database ❌❌❌❌❌❌❌❌❌', err);
        });

      // sequelize.sync({ alter: true }) //, force: true
      //   .then(() => {
      //     console.log(`Models and relation synchronization In DB Successfully ✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔`);
      //   }).catch((err) => {
      //     console.log(`Can't synchronization Models and relation In BD ❌❌❌❌❌❌❌❌❌ ${err.message}`);
      //   });

      return sequelize;
    },
  },
];