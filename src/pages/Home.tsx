import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import VideoEditor from '../components/VideoEditor';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <VideoEditor />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;