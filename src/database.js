import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const database_name = 'users.db';
const database_version = '1.0';
const database_displayname = 'User Database';
const database_size = 200000;

let db = null;
export const getDBConnection = async () => {
  if (db !== null) {
    console.log('Вже є підключення до БД');
    return db;
  }

  try {
    db = await SQLite.openDatabase({
      name: database_name,
      location: 'default',
    });
    console.log('База даних відкрита', db);
    return db;
  } catch (error) {
    console.error('Помилка підключення до SQLite', error);
    throw error;
  }
};



export const createUsersTable = async () => {
  const db = await getDBConnection();
  if (!db) {
    throw new Error('Не вдалося отримати підключення до бази даних');
  }

  const query = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [],
        () => {
          console.log('Таблиця users створена або вже існує');
          resolve();
        },
        (tx, error) => {
          console.error('Помилка створення таблиці users', error);
          reject(error);
        }
      );
    });
  });
};


export const registerUser = async ({ firstName, lastName, email, phone, password }) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? OR phone = ?;',
        [email, phone],
        (_, results) => {
          if (results.rows.length > 0) {
            reject(new Error('Користувач з таким email або телефоном вже зареєстрований'));
          } else {
            tx.executeSql(
              'INSERT INTO users (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?);',
              [firstName.trim(), lastName.trim(), email.trim().toLowerCase(), phone.trim(), password],
              (_, insertResult) => {
                resolve({
                  id: insertResult.insertId,
                  firstName,
                  lastName,
                  email,
                  phone,
                });
              },
              (tx, error) => {
                console.error('Помилка вставки нового користувача', error);
                reject(error);
              },
            );
          }
        },
        (tx, error) => {
          console.error('Помилка вибірки існуючого користувача при реєстрації', error);
          reject(error);
        },
      );
    });
  });
};

export const loginUser = async ({ email, password }) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?;',
        [email.trim().toLowerCase(), password],
        (_, results) => {
          if (results.rows.length === 1) {
            const row = results.rows.item(0);
            resolve({
              id: row.id,
              firstName: row.firstName,
              lastName: row.lastName,
              email: row.email,
              phone: row.phone,
            });
          } else {
            reject(new Error('Невірний email або пароль'));
          }
        },
        (tx, error) => {
          console.error('Помилка вибірки користувача при логіні', error);
          reject(error);
        },
      );
    });
  });
};
