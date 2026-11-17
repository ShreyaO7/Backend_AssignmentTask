import Teacher from "../models/teacher.model";

export const createTeacher = (data: {
  fullName: string;
  email: string;
  specialization: string;
  experience: number;
}) => {
  return Teacher.create(data);
};

export const findTeacherByEmail = (email: string) => {
  return Teacher.findOne({ email });
};

export const findTeacherById = (id: string) => {
  return Teacher.findById(id);
};
