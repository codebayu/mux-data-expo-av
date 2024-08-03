/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import React, { useEffect, useImperativeHandle, useRef } from 'react';

import * as Device from 'expo-device';
import mux from 'mux-embed';
import { Platform } from 'react-native';
import { MuxOptions, Props } from 'types';
import lib from './package.json';

const assign = mux.utils.assign;

const MIN_REBUFFER_DURATION = 300;

const generateShortId = () => {
  return (
    '000000' + ((Math.random() * Math.pow(36, 6)) << 0).toString(36)
  ).slice(-6);
};

const withMux = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return React.forwardRef<unknown, Props>((props: Props, ref) => {
    const {
      muxOptions,
      progressUpdateIntervalMillis,
      source,
      onLoad,
      onPlaybackStatusUpdate,
      onFullscreenUpdate,
      ...otherProps
    } = props;

    const videoRef = useRef<any>();
    const options: MuxOptions = { ...muxOptions };

    if (!options.application_name) {
      console.error(
        '[mux-react-native-video] missing muxOptions.application_name - this value is required'
      );
    }

    if (progressUpdateIntervalMillis && progressUpdateIntervalMillis !== 250) {
      console.log(
        `[mux-react-native-video] found progressUpdateIntervalMillis value of ${progressUpdateIntervalMillis} - overriding to 250. This is required for the mux-react-native-video to correctly track rebuffering`
      );
      props.progressUpdateIntervalMillis = 250;
    }

    const stateRef = useRef<{ [key: string]: any }>({
      playerID: generateShortId(),
    });

    function saveStateForPlayer(key: string, value: any) {
      stateRef.current[key] = value;
    }

    function getStateForPlayer(key: string) {
      return stateRef.current[key];
    }

    function emit(eventType: string, data?: any) {
      mux.emit(stateRef.current.playerID, eventType, data);
    }

    function emitPlay() {
      setPlayerStatus('play');
      emit('play');
    }

    function emitEnd() {
      setPlayerStatus('ended');
      emit('ended');
    }

    function emitPause() {
      setPlayerStatus('paused');
      emit('pause');
    }

    function emitPlaying() {
      setPlayerStatus('playing');
      emit('playing');
    }

    function setPlayerStatus(status: string) {
      return saveStateForPlayer('currentStatus', status);
    }

    useImperativeHandle(ref, () => ({
      ...videoRef.current,
      mux: { emit },
    }));

    function _onLoad(evt: any) {
      if (evt.durationMillis) {
        saveStateForPlayer('duration', evt.durationMillis);
      }
      onLoad && onLoad(evt);
    }

    function _onPlaybackStatusUpdate(status: any) {
      if (status.isPlaying) {
        if (status.positionMillis <= 5) {
          emitPlay();
        } else if (status.didJustFinish) {
          emitEnd();
        }
      } else if (status.positionMillis > 0) {
        emitPause();
      }
      emitPlaying();
      emit('timeupdate', {
        player_playhead_time: status.positionMillis,
      });
      onPlaybackStatusUpdate && onPlaybackStatusUpdate(status);
    }

    function _onFullscreenUpdate(evt: any) {
      saveStateForPlayer('fullscreenUpdate', evt.fullscreenUpdate);
      if (options.data) {
        options.data.player_is_fullscreen = evt.fullscreenUpdate === 1;
      }
      onFullscreenUpdate && onFullscreenUpdate(evt);
    }

    useEffect(() => {
      options.getPlayheadTime = () => getStateForPlayer('currentTime');
      options.minimumRebufferDuration = MIN_REBUFFER_DURATION;

      const platformName = options.application_name;
      delete options.application_name;

      const platformVersion = options.application_version;
      delete options.application_version;

      options.data = assign(
        {
          player_software_name: 'Expo AV',
          player_mux_plugin_name: '@codebayu/mux-data-expo-av',
          player_mux_plugin_version: lib.version,
          viewer_device_name: Device.deviceName,
          viewer_device_model: Device.modelName,
          viewer_device_manufacturer: Device.manufacturer,
          viewer_device_category: Device.deviceType,
        },
        options.data
      );

      options.getStateData = () => ({
        player_is_paused: getStateForPlayer('currentStatus') === 'paused',
        player_autoplay_on: !otherProps.paused,
        video_source_url: source?.uri,
        video_source_duration: getStateForPlayer('duration'),
        video_poster_url: otherProps.poster,
      });

      options.platform = {
        os: {
          family: Platform.OS,
          version: Platform.Version,
        },
      };

      if (platformName) {
        options.platform.name = platformName;
      }
      if (platformVersion) {
        options.platform.version = platformVersion;
      }

      mux.init(stateRef.current.playerID, options);

      return () => {
        emit('destroy');
      };
    }, []);

    const sourceUri = source?.uri;

    useEffect(() => {
      if (!sourceUri) return;

      if (!getStateForPlayer('sourceUri')) {
        saveStateForPlayer('sourceUri', sourceUri);
        return;
      }

      saveStateForPlayer('sourceUri', sourceUri);
      emit('videochange', {
        video_id: options.data?.video_id,
        video_title: options.data?.video_title,
        video_series: options.data?.video_series,
        video_duration: options.data?.video_duration,
        video_stream_type: options.data?.video_stream_type,
        video_encoding_variant: options.data?.video_encoding_variant,
      });
    }, [sourceUri]);

    return (
      <WrappedComponent
        ref={videoRef}
        onLoad={_onLoad}
        source={source}
        onPlaybackStatusUpdate={_onPlaybackStatusUpdate}
        onFullscreenUpdate={_onFullscreenUpdate}
        progressUpdateIntervalMillis={progressUpdateIntervalMillis}
        {...(otherProps as P)}
      />
    );
  });
};

export default withMux;
