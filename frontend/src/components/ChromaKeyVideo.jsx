import React, { useRef, useEffect } from 'react';

export default function ChromaKeyVideo({
  src = '/img/home/green-screen-video.webm',
  className = '',
  maxHeight = '400px'
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animId;

    const processFrame = () => {
      if (video.paused || video.ended) {
        animId = requestAnimationFrame(processFrame);
        return;
      }

      if (video.videoWidth && video.videoHeight) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const l = frame.data.length;

        for (let i = 0; i < l; i += 4) {
          const r = frame.data[i];
          const g = frame.data[i + 1];
          const b = frame.data[i + 2];

          // Chroma Key: Green screen removal
          // Green dominant over Red and Blue
          if (g > 80 && g > r * 1.15 && g > b * 1.15) {
            frame.data[i + 3] = 0; // Completely transparent
          } else if (g > 60 && g > r * 1.05 && g > b * 1.05) {
            // Feather edge
            const alpha = Math.max(0, 255 - ((g - 60) / 25) * 255);
            frame.data[i + 3] = alpha;
          }
        }
        ctx.putImageData(frame, 0, 0);
      }

      animId = requestAnimationFrame(processFrame);
    };

    const handlePlay = () => {
      animId = requestAnimationFrame(processFrame);
    };

    video.addEventListener('play', handlePlay);

    // Try playing automatically
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('play', handlePlay);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [src]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-auto object-contain pointer-events-none drop-shadow-xl"
        style={{ maxHeight }}
      />
    </div>
  );
}
