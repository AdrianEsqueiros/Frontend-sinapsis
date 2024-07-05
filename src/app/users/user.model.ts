export interface User {
  id: number;
  username: string;
  status: boolean;
  customerId: number;
  customer?: { name: string }; // Optional, adjust according to your needs
}
