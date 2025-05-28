import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateAppealDto {
	@IsString()
	@Expose()
	theme!: string;

	@IsString()
	@Length(1, 1000)
	@Expose()
	message!: string;
}
