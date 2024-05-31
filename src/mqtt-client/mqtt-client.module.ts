import { Module } from '@nestjs/common';
import { MqttClientService } from './mqtt-client.service';

@Module({
  providers: [MqttClientService],
})
export class MqttClientModule {}
