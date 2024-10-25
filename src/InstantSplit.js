import React, { useState } from 'react';
import { Card, Input, Button, Typography, Space, Row, Col, message } from 'antd';
import { Users, Coffee, ShoppingBag, Pizza, DollarSign } from 'lucide-react';

const { Title, Text } = Typography;

const InstantSplit = () => {
  const [amount, setAmount] = useState('');
  const [friends, setFriends] = useState([
    { id: 1, name: 'Alex', selected: false },
    { id: 2, name: 'Sam', selected: false },
    { id: 3, name: 'Jordan', selected: false },
    { id: 4, name: 'Taylor', selected: false }
  ]);
  const [splitAmount, setSplitAmount] = useState(0);

  // Quick amount suggestions
  const quickAmounts = [
    { icon: Coffee, label: 'Coffee', amount: 15 },
    { icon: Pizza, label: 'Lunch', amount: 45 },
    { icon: ShoppingBag, label: 'Shopping', amount: 100 }
  ];

  // Partner merchants
  const merchants = [
    { name: 'Starbucks', logo: Coffee },
    { name: 'Amazon', logo: ShoppingBag },
    { name: 'Deliveroo', logo: Pizza }
  ];

  const handleFriendToggle = (id) => {
    const updatedFriends = friends.map(friend =>
      friend.id === id ? { ...friend, selected: !friend.selected } : friend
    );
    setFriends(updatedFriends);
    calculateSplit(amount, updatedFriends);
  };

  const calculateSplit = (totalAmount, updatedFriends = friends) => {
    const selectedCount = updatedFriends.filter(f => f.selected).length + 1;
    setSplitAmount(totalAmount ? (totalAmount / selectedCount).toFixed(2) : 0);
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    calculateSplit(value);
  };

  const handlePayment = () => {
    message.success('Payment links sent to selected friends!');
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2}>
          <DollarSign style={{ verticalAlign: 'middle' }} />
          InstantSplit
        </Title>
        <Text type="secondary">Split bills, pay instantly</Text>
      </div>

      {/* Amount Input Card */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>Bill Amount</Text>
            <Input
              size="large"
              prefix="£"
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              style={{ fontSize: 24, textAlign: 'center', marginTop: 8 }}
            />
          </div>

          {/* Quick Amounts */}
          <Row gutter={16} justify="space-between">
            {quickAmounts.map(({ icon: Icon, label, amount }) => (
              <Col key={label}>
                <Button
                  icon={<Icon size={16} />}
                  onClick={() => handleAmountChange(amount)}
                  style={{ height: 'auto', padding: '8px 16px' }}
                >
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary">£{amount}</Text>
                  </div>
                </Button>
              </Col>
            ))}
          </Row>
        </Space>
      </Card>

      {/* Friends Selection Card */}
      <Card title="Split With" style={{ marginBottom: 16 }}>
        <Row gutter={[8, 8]}>
          {friends.map((friend) => (
            <Col span={12} key={friend.id}>
              <Button
                icon={<Users size={16} />}
                onClick={() => handleFriendToggle(friend.id)}
                type={friend.selected ? 'primary' : 'default'}
                style={{ width: '100%' }}
              >
                {friend.name}
              </Button>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Split Result Card */}
      {splitAmount > 0 && (
        <Card 
          style={{ 
            marginBottom: 16, 
            backgroundColor: '#f0f5ff',
            textAlign: 'center'
          }}
        >
          <Text type="secondary">Each person pays</Text>
          <Title level={2} style={{ margin: '8px 0', color: '#1890ff' }}>
            £{splitAmount}
          </Title>
          <Button type="primary" block onClick={handlePayment}>
            Send Payment Links
          </Button>
        </Card>
      )}

      {/* Merchant Options Card */}
      <Card title="Instantly spend your split at">
        <Row justify="space-between">
          {merchants.map(({ name, logo: Icon }) => (
            <Col key={name}>
              <Button
                icon={<Icon size={20} />}
                style={{ height: 'auto', padding: '8px 16px' }}
              >
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary">{name}</Text>
                </div>
              </Button>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default InstantSplit;