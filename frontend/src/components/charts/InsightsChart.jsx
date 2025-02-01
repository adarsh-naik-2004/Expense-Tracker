import { useState, useEffect } from 'react';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';
import { ToggleButtonGroup, ToggleButton, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import NoDataMessage from './NoDataMessage';

const InsightsChart = ({ data, refreshKey }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setTotalExpenses(0);
      return;
    }

    // **Aggregate expenses by category**
    const aggregatedData = data.reduce((acc, item) => {
      if (!item.category || isNaN(Number(item.amount))) return acc;

      if (acc[item.category]) {
        acc[item.category] += Number(item.amount);
      } else {
        acc[item.category] = Number(item.amount);
      }
      return acc;
    }, {});

    // **Calculate total expenses**
    const total = Object.values(aggregatedData).reduce((sum, value) => sum + value, 0);
    setTotalExpenses(total);

    // **Format data for charts**
    const formattedData = Object.keys(aggregatedData).map((category, index) => ({
      id: `${category}-${index}`, // Unique ID for PieChart
      category,
      total: aggregatedData[category],
      percent: ((aggregatedData[category] / total) * 100).toFixed(2), // Percentage calculation
    }));

    setChartData(formattedData);
  }, [data, refreshKey]);

  const chartColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main
  ];

  const commonChartProps = {
    colors: chartColors,
    margin: { top: 40, right: 80, bottom: 80, left: 80 },
    sx: {
      '& .MuiChartsAxis-tickLabel': {
        fill: theme.palette.text.primary
      }
    }
  };

  return (
    <Box>
      <ToggleButtonGroup
        value={chartType}
        exclusive
        onChange={(_, newType) => newType && setChartType(newType)}
        sx={{ mb: 3 }}
        color="primary"
      >
        <ToggleButton value="bar">Bar Chart</ToggleButton>
        <ToggleButton value="pie">Pie Chart</ToggleButton>
        <ToggleButton value="line">Line Chart</ToggleButton>
      </ToggleButtonGroup>

      {chartData.length === 0 ? (
        <NoDataMessage />
      ) : (
        <Box sx={{ height: 500 }} key={`${chartType}-${refreshKey}`}>
          {chartType === 'bar' && (
            <BarChart
              {...commonChartProps}
              xAxis={[{ 
                scaleType: 'band', 
                dataKey: 'category',
                label: 'Categories'
              }]}
              series={[{ 
                dataKey: 'total', 
                label: 'Spending'
              }]}
              dataset={chartData}
            />
          )}

          {chartType === 'pie' && (
            <PieChart
              {...commonChartProps}
              series={[{
                data: chartData
                  .filter(item => item.total > 0)
                  .map(item => ({
                    id: item.id,  
                    value: item.total,
                    label: `${item.category} (${item.percent}%)` // Show percentage in label
                  })),
                innerRadius: 40,
                outerRadius: 120,
                paddingAngle: 5,
                cornerRadius: 5,
                cx: 250,
              }]}
            />
          )}

          {chartType === 'line' && (
            <LineChart
              {...commonChartProps}
              xAxis={[{ 
                dataKey: 'category',
                label: 'Categories',
                scaleType: 'point'
              }]}
              series={[{ 
                dataKey: 'total', 
                label: 'Spending',
                curve: 'linear'
              }]}
              dataset={chartData}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default InsightsChart;
