import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttClientModule } from './mqtt-client/mqtt-client.module';

@Module({
  imports: [MqttClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
