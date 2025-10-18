import React, { useEffect, useState } from 'react';
import { Grid, Card, Button, Toast } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import SearchHeader from '../components/common/SearchHeader.jsx';
import { getCategories } from '../services/subscription.js';

const SubscriptionsPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await getCategories();
      const enhancedData = res.data.map(item => ({
        id: item.id,
        name: item.attributes.name,
        icon: item.attributes.icon,
        subscribed: false,
        subcategories: item.attributes.subcategories.data.map(sub => ({
          id: sub.id,
          attributes: {
            ...sub.attributes
          },
          subscribed: false
        }))
      }));

      setCategories(enhancedData);
    };
    getData();
  }, []);

  console.log(categories)

  const handleSubscribe = (categoryId, subcategoryId = null) => {
    setCategories(prev =>
      prev.map(category => {
        if (category.id === categoryId) {
          // Toggle category subscription
          const newStatus = subcategoryId === null ? !category.subscribed : category.subscribed;

          // Show toast only when toggling category
          if (subcategoryId === null) {
            Toast.show({
              content: newStatus ? 'Subscribed to all!' : 'Unsubscribed from all',
              position: 'bottom'
            });
          }

          return {
            ...category,
            subscribed: subcategoryId === null ? newStatus : category.subscribed,
            subcategories: category.subcategories.map(sub => {
              if (subcategoryId !== null) {
                if (sub.id === subcategoryId) {
                  Toast.show({
                    content: !sub.subscribed ? 'Subscribed successfully!' : 'Unsubscribed',
                    position: 'bottom'
                  });
                  return { ...sub, subscribed: !sub.subscribed };
                }
                return sub;
              } else {
                return { ...sub, subscribed: newStatus };
              }
            })
          };
        }
        return category;
      })
    );
  };

  return (
    <>
      <SearchHeader />
      <div style={{ padding: '15px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '15px'
        }}>
          All Subscriptions
        </h2>

        <Grid columns={2} gap={12}>
          {categories.map(category => (
            <Grid.Item key={category.id}>
              <Card
                title={<span>{category.icon} {category.name}</span>}
                style={{
                  borderRadius: '12px',
                  marginBottom: '12px',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ padding: '4px 0' }}>
                  {category.subcategories.map(subcategory => (
                    <div
                      key={subcategory.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid #f5f5f5'
                      }}
                    >
                      <span>{subcategory.attributes.name}</span>
                      <Button
                        size='mini'
                        style={{
                          '--border-radius': '50%',
                          '--background-color': subcategory.subscribed ? '#fa541c' : '#f5f5f5',
                          '--text-color': subcategory.subscribed ? '#fff' : '#333',
                          width: '28px',
                          height: '28px',
                          padding: 0
                        }}
                        onClick={() => handleSubscribe(category.id, subcategory.id)}
                      >
                        {subcategory.subscribed ? '✓' : <AddOutline />}
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  size='mini'
                  style={{
                    '--border-radius': '20px',
                    '--background-color': category.subscribed ? '#fa541c' : '#f5f5f5',
                    '--text-color': category.subscribed ? '#fff' : '#333',
                    width: '100%',
                    marginTop: '8px'
                  }}
                  onClick={() => handleSubscribe(category.id)}
                >
                  {category.subscribed ? '✓ Subscribed' : <><AddOutline /> Subscribe</>}
                </Button>
              </Card>
            </Grid.Item>
          ))}
        </Grid>
      </div>
    </>
  );
};

export default SubscriptionsPage;
