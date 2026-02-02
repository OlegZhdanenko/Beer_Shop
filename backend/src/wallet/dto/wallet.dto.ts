import { IsIn, IsString, Matches } from 'class-validator';

export class WalletDto {
  @IsString()
  @Matches(/^EQ|^UQ/, {
    message: 'Wallet address must be a valid TON address',
  })
  address: string;
  @IsString()
  @IsIn(['testnet', 'mainnet'])
  network: 'testnet' | 'mainnet';
}
