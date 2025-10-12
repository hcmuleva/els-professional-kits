import React, { useRef } from 'react';
import { Button, Swiper, Toast } from 'antd-mobile';
import { AddOutline, RightOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';

const FeaturedSubscriptions = ({ categories, showAllButton, onShowAllClick, onSubscribeCategory }) => {
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const handleCategoryClick = (categoryId) => {
    navigate(`/subscriptions/${categoryId}`);
  };

  const handleAddClick = (e, categoryId) => {
    e.stopPropagation();
    if (onSubscribeCategory) {
      onSubscribeCategory(categoryId);
    }
    Toast.show({
      content: `Added ${categoryId} to your subscriptions`,
      position: 'bottom',
    });
    navigate('/subscriptions');
  };


  return (
    <div style={{
      padding: '0 15px 20px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      margin: '10px',
      // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '15px 0',
        padding: '5px 0'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          margin: 0,
          color: '#333'
        }}>
          Featured Subscriptions
        </h2>
        {showAllButton && (
          <Button
            size='small'
            fill='none'
            style={{
              color: '#fa541c',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              padding: '4px 12px'
            }}
            onClick={onShowAllClick}
          >
            View All <RightOutline style={{ fontSize: '12px', marginLeft: '4px' }} />
          </Button>
        )}
      </div>

      <Swiper
        ref={swiperRef}
        style={{
          borderRadius: '10px',
          '--track-padding': '0 0 16px 0',
        }}
        slideSize={80}
        trackOffset={0}
        stuckAtBoundary={false}
        indicator={() => null}
      >
        {categories.map(category => (
          <Swiper.Item key={category.id}>
            <div
              style={{
                marginRight: '12px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
                position: 'relative',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                height: '220px',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div style={{
                height: '140px',
                backgroundImage: `url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <Button
                  size='mini'
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    '--border-radius': '50%',
                    '--background-color': 'rgba(255, 255, 255, 0.9)',
                    '--text-color': '#fa541c',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  onClick={(e) => handleAddClick(e, category.id)}
                >
                  <AddOutline style={{ fontSize: '18px' }} />
                </Button>
              </div>
              <div style={{
                padding: '12px',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '4px'
                }}>
                  {category.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  {category.subtitle}
                </div>
                <div style={{
                  marginTop: '8px',
                  fontSize: '13px',
                  color: '#fa541c',
                  fontWeight: '500'
                }}>
                  Tap to explore
                </div>
              </div>
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedSubscriptions;