interface OrderAnalytics {
  totalRevenue: number;
  averageOrderValue: number;
  userSpendingPatterns: {
    userId: number;
    userName: string;
    totalSpent: number;
    orderCount: number;
    averageOrderValue: number;
    spendingTrend: number[];
  }[];
  statusDistribution: {
    [key: string]: number;
  };
  dailyRevenue: {
    date: string;
    revenue: number;
    orderCount: number;
  }[];
  complexCalculation: number;
}

function generateFibonacci(n: number): number {
  if (n <= 1) return n;
  return generateFibonacci(n - 1) + generateFibonacci(n - 2);
}

function calculateSpendingTrend(orders: any[]): number[] {
  // Simulate complex calculation with Fibonacci
  const trendPoints = 10;
  return Array.from({ length: trendPoints }, (_, i) => {
    // Make it CPU intensive by calculating fibonacci numbers
    const fib = generateFibonacci(20 + i);
    const baseValue = orders.length > 0 ? orders[0].total_amount : 0;
    return baseValue * (fib / 1000);
  });
}

export function analyzeOrders(orders: any[], users: any[]): OrderAnalytics {
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

  // Calculate average order value
  const averageOrderValue = totalRevenue / orders.length;

  // Calculate user spending patterns
  const userSpendingMap = new Map();
  users.forEach(user => {
    const userOrders = orders.filter(order => order.user_name === user.name);
    const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    
    userSpendingMap.set(user.id, {
      userId: user.id,
      userName: user.name,
      totalSpent,
      orderCount: userOrders.length,
      averageOrderValue: totalSpent / userOrders.length,
      spendingTrend: calculateSpendingTrend(userOrders)
    });
  });

  // Status distribution
  const statusDistribution = orders.reduce((acc: any, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  // Daily revenue
  const dailyRevenueMap = new Map();
  orders.forEach(order => {
    const date = new Date(order.created_at).toISOString().split('T')[0];
    const existing = dailyRevenueMap.get(date) || { revenue: 0, orderCount: 0 };
    dailyRevenueMap.set(date, {
      date,
      revenue: existing.revenue + parseFloat(order.total_amount),
      orderCount: existing.orderCount + 1
    });
  });

  // Make it more CPU intensive with a complex calculation
  let complexCalculation = 0;
  for (let i = 0; i < orders.length; i++) {
    // Calculate fibonacci numbers for each order
    complexCalculation += generateFibonacci(25);
    
    // Add some trigonometric calculations
    for (let j = 0; j < 1000; j++) {
      complexCalculation += Math.sin(j) * Math.cos(j) * Math.tan(j);
    }
  }

  return {
    totalRevenue,
    averageOrderValue,
    userSpendingPatterns: Array.from(userSpendingMap.values()),
    statusDistribution,
    dailyRevenue: Array.from(dailyRevenueMap.values()),
    complexCalculation
  };
} 