import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Alert, } from 'antd';
import axios from 'axios';
import { 
  Globe, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Search,
  Shield
} from 'lucide-react';



const PayoutSimulator = () => {
  const [amount, setAmount] = useState(1000);
  const [selectedCountry, setSelectedCountry] = useState('USD');
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer');
  const [data, setData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [rates, setRates] = useState({});
  const [symbols, setSymbols] = useState({});

  const fixerUrl = process.env.REACT_APP_FIXER_API_URL;
  const apiKey = process.env.REACT_APP_FIXER_API_KEY;

  // Payment method options remain static
  const payoutMethods = {
    bank_transfer: { name: 'Bank Transfer', time: '1-2 hours', fee: 0.005 },
    instant_payment: { name: 'Instant Payment', time: '< 1 minute', fee: 0.015 },
    digital_wallet: { name: 'Digital Wallet', time: '< 5 minutes', fee: 0.01 },
    gift_card: { name: 'Gift Card', time: 'Instant', fee: 0.02 }
  };
  useEffect(() => {
    axios.get(`${fixerUrl}symbols?access_key=${apiKey}`)
      .then(response => {
        setSymbols(response.data.symbols);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);
  useEffect(()=>{
    axios.get(`${fixerUrl}latest?access_key=${apiKey}`)
      .then(response => {
        setRates(response.data.rates);
      })
      .catch(error => {
        console.log(error);
      });
      
  },[])

  

  const simulatePayout = () => {
    setProcessing(true);
    setTimeout(() => {
      const sourceRate = rates['USD']; // USD to EUR rate
      const targetRate = rates[selectedCountry]; // EUR to target currency rate
      const method = payoutMethods[payoutMethod];
      
      // Calculate conversion: USD -> EUR -> Target Currency
      const amountInEur = amount / sourceRate;
      const convertedAmount = amountInEur * targetRate;
      const fee = amount * method.fee;
      
      setResult({
        originalAmount: amount,
        fee: fee,
        convertedAmount: convertedAmount,
        estimatedTime: method.time,
        currency: selectedCountry
      });
      
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white m-0">Anur Payout Simulator</h2>
            <p className="text-gray-400">Experience instant global payments</p>
          </div>
          <Button 
            type="ghost"
            icon={<Search className="w-4 h-4" />}
            onClick={() => setResult(null)}
          >
            New Simulation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuration Card */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h4 className="text-xl font-bold text-white mb-6">Configure Payout</h4>
            <div className="space-y-6">
              <div>
                <label className="text-gray-400 block mb-2">Amount (USD)</label>
                <Input
                  prefix={<DollarSign className="w-4 h-4" />}
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-2">Destination Currency</label>
                <Select
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                >
                  {Object.entries(symbols).map(([code, name]) => (
                    <Select.Option key={code} value={code}>
                      {code} - {name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-gray-400 block mb-2">Payout Method</label>
                <Select
                  value={payoutMethod}
                  onChange={setPayoutMethod}
                  className="w-full"
                >
                  {Object.entries(payoutMethods).map(([key, method]) => (
                    <Select.Option key={key} value={key}>{method.name}</Select.Option>
                  ))}
                </Select>
              </div>

              <Button 
                type="primary"
                block
                size="large"
                onClick={simulatePayout}
                loading={processing}
              >
                {processing ? 'Processing...' : 'Simulate Payout'}
              </Button>
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h4 className="text-xl font-bold text-white mb-6">Simulation Results</h4>
            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <span className="text-gray-400 block">Original Amount</span>
                    <span className="text-2xl font-bold text-white">
                      USD {result.originalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <span className="text-gray-400 block">Converted Amount</span>
                    <span className="text-2xl font-bold text-white">
                      {result.currency} {result.convertedAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <span className="text-gray-400 block">Fee</span>
                    <span className="text-2xl font-bold text-white">
                      USD {result.fee.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <span className="text-gray-400 block">Estimated Time</span>
                    <span className="text-2xl font-bold text-white">
                      {result.estimatedTime}
                    </span>
                  </div>
                </div>

                <Alert
                  message={
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>
                        Sending {result.currency} {result.convertedAmount.toFixed(2)} via {payoutMethods[payoutMethod].name}
                      </span>
                    </div>
                  }
                  type="info"
                  className="bg-blue-900 border-blue-800"
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Configure and simulate a payout to see results
              </div>
            )}
          </div>
        </div>

        {/* Features Card */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h4 className="text-xl font-bold text-white mb-6">Why Choose Anur?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg">
              <Clock className="w-8 h-8 text-blue-400" />
              <div>
                <span className="text-white block font-medium">Instant Payouts</span>
                <span className="text-gray-400">Send money in seconds</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg">
              <Globe className="w-8 h-8 text-blue-400" />
              <div>
                <span className="text-white block font-medium">Global Coverage</span>
                <span className="text-gray-400">170+ currencies supported</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <div>
                <span className="text-white block font-medium">Low Fees</span>
                <span className="text-gray-400">Competitive rates worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutSimulator;