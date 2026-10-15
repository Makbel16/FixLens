import { CoordinateTransformer } from '../src/engine/coordinateTransformer';
import { CoordinateTransformConfig } from '../src/types/ar';
import { BoundingBox } from '../src/types/ocr';

describe('Coordinate Transformer Tests', () => {
  let transformer: CoordinateTransformer;

  beforeEach(() => {
    transformer = new CoordinateTransformer(0.5);
  });

  test('transforms coordinates proportionally in aspectFill mode', () => {
    const config: CoordinateTransformConfig = {
      frame: { width: 1920, height: 1080 },
      viewport: { width: 1080, height: 1920 }, // Vertical phone screen
      mode: 'aspectFill',
    };

    const sourceBox: BoundingBox = {
      x: 960,
      y: 540,
      width: 100,
      height: 50,
    };

    const transformed = transformer.transformBox(sourceBox, config);
    expect(transformed.width).toBeGreaterThan(0);
    expect(transformed.height).toBeGreaterThan(0);
    expect(transformed.x).toBeGreaterThanOrEqual(0);
    expect(transformed.y).toBeGreaterThanOrEqual(0);
  });

  test('smooths out jitter over consecutive small movements', () => {
    const config: CoordinateTransformConfig = {
      frame: { width: 1000, height: 1000 },
      viewport: { width: 500, height: 500 },
      mode: 'aspectFill',
    };

    const box1: BoundingBox = { x: 200, y: 200, width: 100, height: 100 };
    const first = transformer.transformBox(box1, config);

    // Minor hand tremor: +10px
    const box2: BoundingBox = { x: 210, y: 210, width: 100, height: 100 };
    const second = transformer.transformBox(box2, config);

    // Expect smoothed position to be between first and raw target
    expect(second.x).toBeLessThan(box2.x * 0.5 + 1);
    expect(second.x).toBeGreaterThanOrEqual(first.x);
  });
});
