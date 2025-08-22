import Hero3D from '../components/Hero3D';
import Features3D from '../components/Features3D';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import VideoEditor3D from '../components/VideoEditor3D';

const Home = () => {
  return (
    <>
      <Hero3D />
      <Features3D />
      <HowItWorks />
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <VideoEditor3D />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;