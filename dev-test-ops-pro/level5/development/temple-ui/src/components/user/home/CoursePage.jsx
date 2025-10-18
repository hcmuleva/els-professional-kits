import React, { useState } from 'react';
import { Carousel, Card, Button, Image, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import ContentView from './ContentView';

const { Meta } = Card;

const CourseContentSlider = ({ course }) => {
  console.log("course", course)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Extract contents from the nested data structure
  const contents = course?.attributes?.contents?.data || [];
  
  if (contents.length === 0) {
    return <div>No content available for this course</div>;
  }

  const featuredContent = contents[currentSlide]?.attributes || contents[0]?.attributes;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(6, contents.length), // Show more thumbnails
    slidesToScroll: 1,
    beforeChange: (current, next) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(5, contents.length),
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(4, contents.length),
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(3, contents.length),
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: Math.min(2, contents.length),
        }
      }
    ]
  };

  return (
    <div className="course-slider-container" style={{ margin: '4px 0' }}>
      {/* Featured Content Section */}
      <div className="featured-content" style={{ 
        marginBottom: 1,
        padding: 24,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
      }}>
        <Row gutter={24} align="middle">
          {/* <Col xs={24} md={14}>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>{featuredContent?.title}</h2>
            <p style={{ color: '#666', marginBottom: 16 }}>{featuredContent?.subtitle}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button type="primary">READ MORE</Button>
              <Button>TAKE A TOUR</Button>
            </div>
          </Col> */}
          <Col xs={24} md={14}>
          <h2 style={{ fontSize: 14, marginBottom: 8 }}>{featuredContent?.title}</h2>
            <p style={{ fontSize: 12,color: '#666', marginBottom: 16 }}>{featuredContent?.subtitle}</p>

          </Col>
          <Col xs={24} md={10}>
          <ContentView content={featuredContent}/>
            {/* <Image
              src={featuredContent?.coverurl}
              alt={featuredContent?.title}
              style={{ 
                borderRadius: 8,
                width: '100%',
                maxHeight: 200,
                objectFit: 'cover'
              }}
              preview={false}
            /> */}
          </Col>
        </Row>
      </div>

      {/* Thumbnail Carousel */}
      <div style={{ position: 'relative' }}>
  <Carousel
    {...settings}
    arrows
    prevArrow={<LeftOutlined />}
    nextArrow={<RightOutlined />}
    style={{ padding: '0 1px' }} // Was 10px before
  >
    {contents.map((content, index) => (
      <div key={content.id} style={{ padding: '0 1px' }}> {/* Fixed padding */}
        <div
          onClick={() => setCurrentSlide(index)}
          style={{
            cursor: 'pointer',
            border: currentSlide === index ? '2px solid #1890ff' : '1px solid #e8e8e8',
            borderRadius: 4,
            overflow: 'hidden',
            height: 100,
            transform: 'scale(0.7)',
            transformOrigin: 'top left',
          }}
        >

        
           
          <Image
            src={content.attributes?.coverurl}
            alt={content.attributes?.title}
            height={70}
            width="100%"
            style={{
              objectFit: 'cover',
              opacity: currentSlide === index ? 1 : 0.8,
            }}
            preview={false}
          /> 
          <div
            style={{
              padding: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: 10,
              background: '#fff',
            }}
          >
            {content.attributes?.title}
          </div>
        </div>
      </div>
    ))}
  </Carousel>
</div>

    </div>
  );
};

// Example usage component
const CoursePage = ({ courses }) => {
  return (
    <div style={{ padding: 24 }}>
      {courses.map(course => (
        <div key={course.id} style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 28, marginBottom: 16 }}>{course.attributes?.title}</h1>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 24 }}>
            {course.attributes?.subtitle}
          </p>
          <CourseContentSlider course={course} />
        </div>
      ))}
    </div>
  );
};

export default CoursePage;