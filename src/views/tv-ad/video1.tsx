
const FullScreenVideo1 = () => {

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <video
        src="/videos/video1.mov" // Path to your video file
        controls
        loop
        className=""
        autoPlay={true}
        muted
        
      ></video>
    </div>
  );
};

export default FullScreenVideo1;
