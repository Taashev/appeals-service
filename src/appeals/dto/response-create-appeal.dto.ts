import { Expose, Transform } from 'class-transformer';

export class ResponseCreateAppealDto {
	@Expose()
	id!: string;

	@Expose({ name: 'created_at' })
	createdAt!: Date;

	@Expose({ name: 'updated_at' })
	updatedAt!: Date;

	@Expose()
	theme!: string;

	@Expose()
	message!: string;

	@Expose()
	@Transform(({ obj }) => obj.status.value)
	status!: string;
}
