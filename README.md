# Mux Data Integration with expo-av

This is a package for using [Mux Data](https://mux.com/data/) for video QoS monitoring with a expo-av player.

If you are using React Native CLI, check out [this package](https://github.com/muxinc/mux-stats-sdk-react-native-video)

View the DemoApp/ directory to see a demo application that implements this library.

## Requirements

- A functioning react-native application that uses react-native-video.
- react-native ~> 16.9
- expo-av ~> 14.0.6

## Installation

```bash
# npm
npm install @codebayu/mux-data-expo-av

# yarn
yarn add @codebayu/mux-data-expo-av
```

## Usage

```tsx
import app from './package.json'; // this is your application's package.json
import { ResizeMode, Video } from 'expo-av'; // import Video from expo-av like you normally would
import { Platform } from 'react-native';
import muxExpoAv from 'mux-react-native-video-sdk';

// wrap the `Video` component with Mux functionality
const MuxVideo = muxExpoAv(Video);

// Pass the same props to `MuxVideo` that you would pass to the
// `Video` element. All of these props will be passed through to your underlying expo-av component
// Include a new prop for `muxOptions`
<MuxVideo
  source={{
    uri: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  }}
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
      video_id: '', // ex: 'abcd123'
      video_title: '', // ex: 'My Great Video'
      video_series: '', // ex: 'Weekly Great Videos'
      video_duration: '', // in milliseconds, ex: 120000
      video_stream_type: 'on-demand', // 'live' or 'on-demand'
      video_cdn: '', // ex: 'Fastly', 'Akamai'

      // Custom Metadata
      custom_1: 'custom value 1',
    },
  }}
/>;
```

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](LICENSE) file for details.
