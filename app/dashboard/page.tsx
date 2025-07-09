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
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#A4DE6C',
  '#D0ED57',
];

export default function DashboardPage() {
  const { t } = useLanguage();
  const { data, isLoading, isError, error } = useQueryApi<DashboardData>({
    url: '1/cape/tasks/dashboard',
    pathname: 'dashboard',
  });

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

  // Transform raw incidentData into array format for PieChart, excluding zero values
  const incidentData: IncidentData[] = data?.incidentDistribution
    ? Object.entries(data.incidentDistribution)
        .map(([name, value]) => ({ name, value: value as number }))
        .filter(item => item.value > 0) 
    : [];
  
  if (incidentData.length < data?.totalTasksSize) incidentData.push({ name: 'Other', value: data.totalTasksSize - incidentData.reduce((sum, item) => sum + item.value, 0) });
  

  // Handle loading state
  if (isLoading) {
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

          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t('dashboard.incidentDistribution')}</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              {incidentData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No incident data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incidentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {incidentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
