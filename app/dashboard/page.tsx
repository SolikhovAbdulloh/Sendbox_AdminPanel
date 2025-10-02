'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useLanguage } from '@/contexts/language-context';
import { useQueryApi } from '@/share/hook/useQuery';
import { CheckSquare, Clock, Laptop, ShieldAlert } from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Define TypeScript interfaces for raw backend data
interface RawTaskData {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

interface RawIncidentData {
  [key: string]: number;
}

// Define TypeScript interfaces for transformed chart data
interface TaskData {
  day: string;
  tasks: number;
}

interface IncidentData {
  name: string;
  value: number;
}

// Define interface for the full dashboard data
interface DashboardData {
  totalTasksSize: number;
  detectedIncidents: number;
  pendingTasks: number;
  virtualMachines: number;
  totalTasksByLastSevenDays: RawTaskData;
  incidentDistribution: RawIncidentData;
}

// Define COLORS for PieChart
const COLORS = [
  '#FF8042',
  '#00C49F',
  '#FFBB28',
  '#8884D8',
  '#82CA9D',
  '#0088FE',
  '#A4DE6C',
];

export default function DashboardPage() {
  const { t } = useLanguage();
  const { data, isLoading, isError, error, isFetching } = useQueryApi<DashboardData>({
    url: '1/cape/tasks/dashboard',
    pathname: 'dashboard',
  });
  const TOP_CATEGORIES_COUNT = 6;

  function getDayName(dayIndex: number): { day: string; tasks: number } {
    const days = [
      { day: 'Mon', tasks: data.totalTasksByLastSevenDays.monday },
      { day: 'Tue', tasks: data.totalTasksByLastSevenDays.tuesday },
      { day: 'Wed', tasks: data.totalTasksByLastSevenDays.wednesday },
      { day: 'Thu', tasks: data.totalTasksByLastSevenDays.thursday },
      { day: 'Fri', tasks: data.totalTasksByLastSevenDays.friday },
      { day: 'Sat', tasks: data.totalTasksByLastSevenDays.saturday },
      { day: 'Sun', tasks: data.totalTasksByLastSevenDays.sunday },
    ];
    return days[dayIndex];
  }

  const today = new Date().getDay();
  // Transform raw taskData into array format for LineChart
  const taskData: TaskData[] = data?.totalTasksByLastSevenDays
    ? [
        getDayName((today + 0) % 7),
        getDayName((today + 1) % 7),
        getDayName((today + 2) % 7),
        getDayName((today + 3) % 7),
        getDayName((today + 4) % 7),
        getDayName((today + 5) % 7),
        getDayName((today + 6) % 7),
      ]
    : [];

  const incidentData: IncidentData[] = data?.incidentDistribution
    ? Object.entries(data.incidentDistribution)
        .map(([name, value]) => ({ name, value: value as number }))
        .filter(item => item.value > 0)
    : [];

  if (incidentData.length < data?.totalTasksSize)
    incidentData.push({
      name: 'Other',
      value: data.totalTasksSize - incidentData.reduce((sum, item) => sum + item.value, 0),
    });

  // Ma'lumotlarni qayta ishlash
  const processedIncidentData = incidentData
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Top kategoriyalarni ajratish
  let displayData;
  if (processedIncidentData.length > TOP_CATEGORIES_COUNT) {
    const topCategories = processedIncidentData.slice(0, TOP_CATEGORIES_COUNT);
    const otherCategories = processedIncidentData.slice(TOP_CATEGORIES_COUNT);
    const otherSum = otherCategories.reduce((sum, item) => sum + item.value, 0);

    displayData = [
      ...topCategories,
      {
        name: `Other (${otherCategories.length})`,
        value: otherSum,
        details: otherCategories,
      },
    ];
  } else {
    displayData = processedIncidentData;
  }

  const totalValue = displayData.reduce((sum, item) => sum + item.value, 0);

  // Custom label uchun
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent < 0.05) return null; // 5% dan kichik bo'lsa ko'rsatma

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: IncidentData & { details?: IncidentData[] };
      [key: string]: any;
    }>;
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalValue) * 100).toFixed(1);

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Count: {data.value}</p>
          <p className="text-sm text-gray-600">Percentage: {percentage}%</p>
          {data.details && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 font-semibold mb-1">Includes:</p>
              {data.details.slice(0, 3).map((item, i) => (
                <p key={i} className="text-xs text-gray-500">
                  • {item.name} ({item.value})
                </p>
              ))}
              {data.details.length > 3 && (
                <p className="text-xs text-gray-400 mt-1">...and {data.details.length - 3} more</p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Handle loading state
  if (isLoading || isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-lg">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-lg text-red-500">
            Error: {error instanceof Error ? error.message : 'Failed to load data'}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalTasks')}</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalTasksSize ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.detectedIncidents')}
              </CardTitle>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.detectedIncidents ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.pendingTasks')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.pendingTasks ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.virtualMachines')}
              </CardTitle>
              <Laptop className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.virtualMachines ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t('dashboard.tasksLastWeek')}</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {taskData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No task data available</p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    tasks: {
                      label: 'Tasks',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={taskData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, Math.max(1, ...taskData.map(d => d.tasks))]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="tasks"
                        stroke="var(--color-tasks)"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200">
            <Card className="w-full h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Incident Distribution</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Incidents: {totalValue}
                  {processedIncidentData.length > TOP_CATEGORIES_COUNT &&
                    ` • Showing top ${TOP_CATEGORIES_COUNT} categories`}
                </p>
              </CardHeader>
              <CardContent className="h-[400px]">
                {displayData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No incident data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={displayData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={120}
                        fill="#7373b3ff"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {displayData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry) => {
                          const percentage =
                            entry && entry.payload && typeof entry.payload.value === 'number'
                              ? ((entry.payload.value / totalValue) * 100).toFixed(1)
                              : '0.0';
                          return `${value} (${percentage}%)`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
