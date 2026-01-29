export interface ICreateOrderDto {
  userId: number;
  items?: {
    productId: number;
    quantity: number;
  }[];
}
