import React from 'react';

export default function ChromaKeyVideo({
  src = '/img/home/homeanime.mp4',
  className = '',
  maxHeight = '360px'
}) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl border-4 border-gold-300/80 bg-slate-900 group ${className}`}>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ maxHeight }}
      >
        <source src="/img/home/homeanime.mp4" type="video/mp4" />
        <source src="/img/home/green-screen-video.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none rounded-3xl" />
    </div>
  );
}
