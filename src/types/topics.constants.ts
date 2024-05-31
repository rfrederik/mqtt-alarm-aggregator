import { Topics } from './topics';

export const EXPECTED_TOPICS: Topics = {
  parentTopic: 'site/123/photovoltaic/skidControlUnits/01A/status',
  childTopics: [
    'site/123/photovoltaic/skidControlUnits/01A/inverters/1/status',
    'site/123/photovoltaic/skidControlUnits/01A/inverters/2/status',
    'site/123/photovoltaic/skidControlUnits/01A/inverters/3/status',
    'site/123/photovoltaic/skidControlUnits/01A/inverters/4/status',
    'site/123/photovoltaic/skidControlUnits/01A/inverters/5/status',
    'site/123/photovoltaic/skidControlUnits/01A/inverters/6/status',
  ],
};