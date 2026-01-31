export interface CreateUserDto {
  name: string;
  lastname?: string;
  email: string;
  picture?: string;
  password?: string;
  birthdate?: Date;
}
