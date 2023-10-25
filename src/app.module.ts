import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppGateway],
})
export class AppModule {}
