declare module '@metamask/logo' {
    export interface ModelViewerOptions {
      pxNotRatio?: boolean;
      width?: number;
      height?: number;
      followMouse?: boolean;
      slowDrift?: boolean;
    }
  
    export default function ModelViewer(options: ModelViewerOptions): {
      container: HTMLDivElement;
      lookAt(position: { x: number; y: number }): void;
      setFollowMouse(enabled: boolean): void;
      stopAnimation(): void;
    };
}
  