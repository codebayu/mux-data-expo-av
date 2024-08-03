import { SafeAreaView, Text } from 'react-native';

import { ResizeMode, Video } from 'expo-av';

import withMux from '@codebayu/mux-data-expo-av';
import app from '../../package.json';

const MuxVideo = withMux(Video);

const video = {
  id: 'randomId',
  uri: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
  title: 'Video Title',
  series: 'Video Series',
};

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text>Home Screen</Text>
      <MuxVideo
        source={{ uri: video.uri }}
        style={{ width: '100%', aspectRatio: 16 / 9 }}
        resizeMode={ResizeMode.COVER}
        isLooping
        useNativeControls
        muxOptions={{
          application_name: app.name, // (required) the name of your application
          application_version: app.version, // the version of your application (optional, but encouraged)
          data: {
            env_key: 'YOUR_ENVIRONMENT_KEY', // (required)
            player_software_version: '5.0.2', // (optional, but encouraged) the version of expo-av that you are using

            // Site Metadata
            viewer_user_id: '12345', // ex: '12345'
            experiment_name: 'player_test_A', // ex: 'player_test_A'
            sub_property_id: 'cus-1', // ex: 'cus-1'

            // Player Metadata
            player_name: '', // ex: 'My Main Player'
            player_version: '', // ex: '1.0.0'
            player_init_time: 0, // ex: 1451606400000

            // Video Metadata
            video_id: video.id, // ex: 'abcd123'
            video_title: video.title, // ex: 'My Great Video'
            video_series: video.series, // ex: 'Weekly Great Videos'
            video_duration: '', // in milliseconds, ex: 120000
            video_stream_type: 'on-demand', // 'live' or 'on-demand'
            video_cdn: '', // ex: 'Fastly', 'Akamai'

            // Custom Metadata
            custom_1: 'custom value 1',
          },
        }}
      />
    </SafeAreaView>
  );
}
