
const BackgroundVideo = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <video
        className="w-full h-full object-cover"
        src="/videos/ds.mp4" 
        autoPlay
        loop
        muted
      />
      {/* Optional overlay för bättre kontrast på UI */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
    </div>
  );
};

export default BackgroundVideo;
