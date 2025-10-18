import React, { useState } from 'react';
import { Card, Button, Modal, Divider, Checkbox } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const SubscriptionPlansDialog = ({ visible, onCancel, onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Basic',
      type: 'Individual',
      monthlyPrice: 199,
      yearlyPrice: 1999,
      features: [
        { text: '10 GB Storage', available: true },
        { text: '10 Mbps Speed', available: true },
        { text: 'Priority Support', available: false },
        { text: 'Manual Backup', available: true },
        { text: 'Advanced Analytics', available: false },
      ],
    },
    {
      name: 'Pro',
      type: 'Professional',
      monthlyPrice: 499,
      yearlyPrice: 4999,
      features: [
        { text: '100 GB Storage', available: true },
        { text: '100 Mbps Speed', available: true },
        { text: 'Priority Support', available: true },
        { text: 'Weekly Auto Backup', available: true },
        { text: 'Advanced Analytics', available: true },
      ],
    },
    {
      name: 'Premium',
      type: 'Enterprise',
      monthlyPrice: 999,
      yearlyPrice: 9999,
      features: [
        { text: '1 TB Storage', available: true },
        { text: '1 Gbps Speed', available: true },
        { text: '24/7 Support', available: true },
        { text: 'Daily Auto Backup', available: true },
        { text: 'Advanced Analytics', available: true },
      ],
    },
  ];

  const handleSubscribe = () => {
    if (!selectedPlan) {
      return;
    }
    const selectedPlanData = plans.find(plan => plan.name === selectedPlan);
    onSubscribe({
      plan: selectedPlan,
      type: selectedPlanData.type,
      price: billingCycle === 'monthly' 
        ? selectedPlanData.monthlyPrice 
        : selectedPlanData.yearlyPrice,
      billingCycle,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Modal
      title="Our Subscription Plans"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit diam nonummy nibh euismod tincidunt. Ut wisi enim ad minim veniam.</p>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Button 
          type={billingCycle === 'monthly' ? 'primary' : 'default'}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </Button>
        <Button 
          type={billingCycle === 'yearly' ? 'primary' : 'default'}
          onClick={() => setBillingCycle('yearly')}
        >
          Yearly (Save 15%)
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {plans.map(plan => (
          <Card
            key={plan.name}
            title={
              <div style={{ textAlign: 'center' }}>
                <h3>{plan.name}</h3>
                <p style={{ color: '#666' }}>{plan.type}</p>
              </div>
            }
            style={{
              flex: 1,
              borderColor: selectedPlan === plan.name ? '#1890ff' : '#f0f0f0',
              boxShadow: selectedPlan === plan.name ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none',
            }}
            onClick={() => setSelectedPlan(plan.name)}
          >
            <div style={{ minHeight: 200 }}>
              {plan.features.map((feature, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  {feature.available ? (
                    <CheckOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  ) : (
                    <CloseOutlined style={{ color: '#f5222d', marginRight: 8 }} />
                  )}
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <Divider />

            <div style={{ textAlign: 'center' }}>
              <h2>
                {billingCycle === 'monthly' 
                  ? formatPrice(plan.monthlyPrice) 
                  : formatPrice(plan.yearlyPrice)}
              </h2>
              <p style={{ color: '#666' }}>per {billingCycle === 'monthly' ? 'month' : 'year'}</p>
              <Button 
                type={selectedPlan === plan.name ? 'primary' : 'default'}
                style={{ marginTop: 16 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(plan.name);
                }}
              >
                {selectedPlan === plan.name ? 'Selected' : 'Select'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button 
          type="primary" 
          size="large"
          disabled={!selectedPlan}
          onClick={handleSubscribe}
        >
          Subscribe Now
        </Button>
      </div>
    </Modal>
  );
};

export default SubscriptionPlansDialog;