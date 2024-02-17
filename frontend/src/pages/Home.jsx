import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slide from '../components/Slide';
import { useState } from 'react';
import Course from '../components/Course';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // For screens wider than 1024 pixels, only show 1 slide at a time
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1, // Update to show only 1 slide at a time for medium screens
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    customPaging: i => (
      <div
        style={{
          width: '10px',
          height: '10px',
          color: 'white',
          border: '2px solid white',
          borderRadius: '50%',
          background: i === currentSlide ? 'white' : 'transparent'
        }}
      ></div>
    ),
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  
  const courseSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    customPaging: i => (
      <div
        style={{
          width: '10px',
          height: '10px',
          color: 'white',
          border: '2px solid white',
          borderRadius: '50%',
          background: i === currentSlide ? 'white' : 'transparent'
        }}
      ></div>
    ),
  };

  return (
    <>
      <Slider {...settings}>
        <Slide title="Explore a future in IT. Start learning toward AWS certification, CompTIA A+ certification, and more." image="/images/banner4.jpg"></Slide>
        <Slide title="Get back on track and achieve your goals. 5–10 minutes a day will do." image="/images/banner5.jpg"></Slide>
        <Slide title="Unlock Your Potential: Discover New Horizons and Master Skills with Expert Guidance" image="/images/banner3.jpg"></Slide>
      </Slider>
      <div className="mt-10 ml-15">
        <div className="text-4xl">
        Recommended for you
        </div>
        <div>
          <Course />
        </div>
      </div>
    </>
    
  );
}
function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full`}
      style={{ ...style, display: 'block', zIndex: 1000 }} // Add zIndex to ensure the arrow is on top of other elements
      onClick={onClick}
    >
      Prev
    </div>
  );
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full`}
      style={{ ...style, display: 'block', zIndex: 1000 }} // Add zIndex to ensure the arrow is on top of other elements
      onClick={onClick}
    >
      Next
    </div>
  );
}

export default HomePage;
