export interface Campaign {
  id: number;
  name: string;
  process_date: string;
  process_hour: string;
  process_status: number;
  phone_list: string[] | string;
  message_text: string;
  userId: number;
  user?: { username: string };
}
