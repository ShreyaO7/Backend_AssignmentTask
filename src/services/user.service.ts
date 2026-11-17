import User from "../models/user.model";

export const createUser = (data: { fullName: string; email: string; phone: string }) => {
  return User.create(data);
};

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
};

export const findUserById = (id: string) => {
  return User.findById(id);
};
