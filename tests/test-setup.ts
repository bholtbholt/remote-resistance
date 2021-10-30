import 'core-js';
import 'ts-jest';
import { resetTestState } from './test-helper';

afterEach(() => {
  return resetTestState();
});
