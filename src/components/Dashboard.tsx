
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { ChartLine, CircleCheck, Clock } from 'lucide-react';

const mockData = [
  { name: 'Mon', value: 23 },
  { name: 'Tue', value: 40 },
  { name: 'Wed', value: 35 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 30 },
  { name: 'Sat', value: 55 },
  { name: 'Sun', value: 65 }
];

const StatCard = ({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) => {
  const isPositive = !change.includes('-');
  
  return (
    <div className="stats-card bg-gradient-to-br from-sol-dark-card/80 to-sol-dark-card backdrop-blur-md border border-sol-green/10 shadow-[0_4px_15px_-3px_rgba(22,163,74,0.15)]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sol-muted text-sm font-medium">{title}</h3>
        <span className="text-sol-green">{icon}</span>
      </div>
      <p className="text-4xl font-bold text-sol-light mb-1">{value}</p>
      <p className={`text-xs ${isPositive ? 'text-sol-green' : 'text-red-500'}`}>
        {change}
      </p>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 -mt-10 mb-24">
      <div className="bg-gradient-to-b from-sol-dark-card/95 to-sol-dark-card/80 backdrop-blur-xl border border-sol-green/10 rounded-lg overflow-hidden p-6 md:p-8 shadow-[0_10px_30px_-5px_rgba(22,163,74,0.1)]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-green-200/80 bg-clip-text text-transparent">SOL Transaction Overview</h2>
            <p className="text-sol-muted text-sm">Real-time monitoring dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Total Transactions" 
            value="247" 
            change="+12% from last week" 
            icon={<ChartLine className="h-4 w-4" />} 
          />
          <StatCard 
            title="Success Rate" 
            value="84%" 
            change="+3% from last week" 
            icon={<CircleCheck className="h-4 w-4" />} 
          />
          <StatCard 
            title="Avg. Confirm Time" 
            value="2.4s" 
            change="-18ms from last week" 
            icon={<Clock className="h-4 w-4" />} 
          />
        </div>

        <div className="h-64 relative rounded-lg p-4 bg-gradient-to-br from-sol-dark-card/50 to-black/30 backdrop-blur-md border border-sol-green/5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{fill: '#A3A3A3'}}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(17, 17, 17, 0.8)',
                  backdropFilter: 'blur(12px)',
                  borderColor: 'rgba(22, 163, 74, 0.2)',
                  borderRadius: '0.5rem',
                  color: '#E5E5E5',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#16A34A" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
