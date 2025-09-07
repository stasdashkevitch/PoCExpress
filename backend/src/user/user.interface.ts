export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  address?: {
    city: string;
    street: string;
  };
}
