
export enum Category {
  COMPUTER_SCIENCE = 'Computer Science',
  MATHEMATICS = 'Mathematics',
  BUSINESS = 'Business',
  ARTS = 'Arts',
  SCIENCE = 'Science',
  GENERAL = 'General'
}

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  EDUCATOR = 'educator'
}

export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  category: Category;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  university: string;
  faculty: string;
  module: string;
  fileUrl?: string;
  fileName?: string;
  isVerified?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  major?: string;
  role: UserRole;
  joinedAt: number;
}
