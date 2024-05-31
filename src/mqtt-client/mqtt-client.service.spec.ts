import { MqttClientService } from './mqtt-client.service';
import { EXPECTED_TOPICS } from '../types/topics.constants';
import mqtt from 'mqtt';

jest.mock('mqtt');

describe('MqttClientService', () => {
  let service: MqttClientService;
  const mockClient = {
    on: jest.fn(),
    subscribe: jest.fn(),
    publish: jest.fn(),
  };
  let connectCallback: () => void;
  let messageCallback: (topic: string, message: string) => void;

  beforeEach(() => {
    (mqtt.connect as jest.Mock).mockReturnValue(mockClient);
    service = new MqttClientService();

    connectCallback = mockClient.on.mock.calls.find(
      (call) => call[0] === 'connect'
    )?.[1];
    if (connectCallback) {
      connectCallback();
    }

    const messageCallbacks = mockClient.on.mock.calls.filter(
      (call) => call[0] === 'message'
    );
    if (messageCallbacks.length > 0) {
      messageCallback = messageCallbacks[0][1];
    } else {
      fail('Message event callback not found');
    }
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should subscribe to child topics on connect', () => {
    expect(mockClient.subscribe).toHaveBeenCalledTimes(6);
  });

  it('should publish 1 to parent topic when all child topics are good', () => {
    EXPECTED_TOPICS.childTopics.forEach((topic) => {
      messageCallback(topic, '1');
    });
    expect(mockClient.publish).toHaveBeenCalledWith(
      EXPECTED_TOPICS.parentTopic,
      '1'
    );
  });

  it('should publish 0 to parent topic when some child topics are not good', () => {
    messageCallback(
      'site/123/photovoltaic/skidControlUnits/01A/inverters/1/status',
      '0'
    );
    messageCallback(
      'site/123/photovoltaic/skidControlUnits/01A/inverters/2/status',
      '1'
    );
    expect(mockClient.publish).toHaveBeenCalledWith(
      'site/123/photovoltaic/skidControlUnits/01A/status',
      '0'
    );
  });
});