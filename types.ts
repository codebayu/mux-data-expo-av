export interface MuxOptions {
  application_name?: string;
  application_version?: string;
  getPlayheadTime?: () => number;
  minimumRebufferDuration?: number;
  data?: Record<string, any>;
  getStateData?: () => Record<string, any>;
  platform?: {
    layout?: string;
    product?: string;
    manufacturer?: string;
    os?: {
      family: string;
      version: number | string;
    };
    name?: string;
    version?: string;
  };
}

export interface Props {
  muxOptions: MuxOptions;
  progressUpdateIntervalMillis?: number;
  source: { uri: string };
  [key: string]: any;
  onLoad?: (evt: any) => void;
  onPlaybackStatusUpdate?: (evt: any) => void;
  onFullscreenUpdate?: (evt: any) => void;
}
