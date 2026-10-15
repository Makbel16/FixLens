import { BoundingBox } from '../types/ocr';
import { CoordinateTransformConfig } from '../types/ar';

export class CoordinateTransformer {
  private smoothedBox: BoundingBox | null = null;
  private readonly alpha: number; // Smoothing factor (0 < alpha <= 1). Default 0.45.

  constructor(alpha: number = 0.45) {
    this.alpha = alpha;
  }

  /**
   * Transforms a bounding box from camera frame coordinates to preview viewport screen coordinates.
   */
  public transformBox(
    box: BoundingBox,
    config: CoordinateTransformConfig
  ): BoundingBox {
    const { frame, viewport, mode } = config;

    if (frame.width <= 0 || frame.height <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    const scaleX = viewport.width / frame.width;
    const scaleY = viewport.height / frame.height;

    let scale: number;
    let offsetX: number;
    let offsetY: number;

    if (mode === 'aspectFill') {
      scale = Math.max(scaleX, scaleY);
      offsetX = (viewport.width - frame.width * scale) / 2;
      offsetY = (viewport.height - frame.height * scale) / 2;
    } else {
      scale = Math.min(scaleX, scaleY);
      offsetX = (viewport.width - frame.width * scale) / 2;
      offsetY = (viewport.height - frame.height * scale) / 2;
    }

    const rawTransformed: BoundingBox = {
      x: box.x * scale + offsetX,
      y: box.y * scale + offsetY,
      width: box.width * scale,
      height: box.height * scale,
    };

    // Clamp coordinates to viewport boundaries with a margin
    const clamped: BoundingBox = {
      x: Math.max(0, Math.min(viewport.width - 20, rawTransformed.x)),
      y: Math.max(0, Math.min(viewport.height - 20, rawTransformed.y)),
      width: Math.min(viewport.width - Math.max(0, rawTransformed.x), rawTransformed.width),
      height: Math.min(viewport.height - Math.max(0, rawTransformed.y), rawTransformed.height),
    };

    // Apply Exponential Moving Average (EMA) to smooth out hand jitter
    const smoothed = this.smooth(clamped);
    return smoothed;
  }

  /**
   * Applies Exponential Moving Average filter across frames to prevent jittering.
   */
  private smooth(newBox: BoundingBox): BoundingBox {
    if (!this.smoothedBox) {
      this.smoothedBox = { ...newBox };
      return this.smoothedBox;
    }

    // If box jumped abruptly across more than half the screen, reset smoother
    const deltaX = Math.abs(newBox.x - this.smoothedBox.x);
    const deltaY = Math.abs(newBox.y - this.smoothedBox.y);
    if (deltaX > 200 || deltaY > 200) {
      this.smoothedBox = { ...newBox };
      return this.smoothedBox;
    }

    const a = this.alpha;
    this.smoothedBox = {
      x: Math.round(a * newBox.x + (1 - a) * this.smoothedBox.x),
      y: Math.round(a * newBox.y + (1 - a) * this.smoothedBox.y),
      width: Math.round(a * newBox.width + (1 - a) * this.smoothedBox.width),
      height: Math.round(a * newBox.height + (1 - a) * this.smoothedBox.height),
    };

    return this.smoothedBox;
  }

  /**
   * Clears smoothing history (e.g., on step transition or camera reset).
   */
  public reset(): void {
    this.smoothedBox = null;
  }
}
