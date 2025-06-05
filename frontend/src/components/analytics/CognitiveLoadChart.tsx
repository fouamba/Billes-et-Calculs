import { useEffect, useRef } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useAnalyticsStore } from '@/stores/analyticsStore';

interface ProgressData {
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

export function CognitiveLoadChart() {
  const analyticsStore = useAnalyticsStore();
  const data = useRef<ProgressData[]>([]);

  useEffect(() => {
    // Format des données pour Nivo
    data.current = [{
      id: 'charge-cognitive',
      data: [{
        x: new Date().toISOString(),
        y: analyticsStore.cognitiveLoadEstimate
      }]
    }];
  }, [analyticsStore.cognitiveLoadEstimate]);

  return (
    <div style={{ height: 300 }}>
      <ResponsiveLine
        data={data.current}
        margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
        xScale={{ type: 'time', format: '%Y-%m-%dT%H:%M:%S.%LZ' }}
        yScale={{ type: 'linear', min: 0, max: 1 }}
        axisBottom={{
          format: '%H:%M:%S',
          tickRotation: -45,
          legend: 'Temps',
          legendOffset: 40
        }}
        axisLeft={{
          legend: 'Charge cognitive',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        enablePoints={false}
        enableArea={true}
        areaOpacity={0.15}
        curve="monotoneX"
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: 12,
                fill: '#666'
              }
            },
            legend: {
              text: {
                fontSize: 14,
                fill: '#666'
              }
            }
          },
          grid: {
            line: {
              stroke: '#ddd',
              strokeDasharray: '2 4'
            }
          }
        }}
      />
    </div>
  );
}
