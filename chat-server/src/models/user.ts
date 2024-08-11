export interface User {
  id: string;
  username: string;
  password: string;
}

const users: User[] = [];

export const addUser = (user: User) => {
  users.push(user);
};

export const findUserByUsername = (username: string) => {
  return users.find(user => user.username === username);
};

export const findUserById = (id: string) => {
  return users.find(user => user.id === id);
};
