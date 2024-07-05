export interface Message {
  id?: number
  campaignId: number;
  text: string;
  process_date: string;
  process_hour: string;
  shipping_status: number;
  phone:string;
}
