import { Injectable } from '@nestjs/common';
import { Topics } from 'src/types/topics';
import { EXPECTED_TOPICS } from '../types/topics.constants';
import mqtt, { MqttClient } from 'mqtt';

@Injectable()
export class MqttClientService {
  private client: MqttClient;
  private topics: Topics = EXPECTED_TOPICS;

  private topicStates: { [topic: string]: string } = {};

  constructor() {
    this.initializeChildTopicsState()
    this.client = mqtt.connect('mqtt://localhost:1883');
    this.client.on('connect', () => {
      this.subscribeToChildTopics();
    });
  }

  private subscribeToChildTopics() {
    this.topics.childTopics.forEach((topic) => {
      this.client.subscribe(topic);
    });

    this.client.on('message', (topic, message) => {
      this.topicStates[topic] = message.toString();
      this.publishToParentTopic();
    });
  }

  private publishToParentTopic() {
    if (this.allChildTopicsAreGood()) {
      this.client.publish(this.topics.parentTopic, '1');
    } else {
      this.client.publish(this.topics.parentTopic, '0');
    }
  }

  private allChildTopicsAreGood(): boolean {
    return this.topics.childTopics.every(
      (topic) => this.topicStates[topic] === '1',
    );
  }

  private initializeChildTopicsState() {
    this.topics.childTopics.forEach((topic) => {
      this.topicStates[topic] = '1';
    });
  }
}
