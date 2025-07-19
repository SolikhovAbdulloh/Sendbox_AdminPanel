import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

export const VideoPlayer = ({ streamUrl }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (Hls.isSupported() && streamUrl) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <video
      ref={videoRef}
      autoPlay
      style={{
        width: '100%',
        height: '600px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};
