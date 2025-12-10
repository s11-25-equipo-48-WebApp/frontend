import { useSession } from 'next-auth/react';
import api from './config';
import { useStore } from '@/store/zustand';

interface Filters {
  start_date?: string;
  end_date?: string;
  event_type?: 'view' | 'submission' | 'approval' | 'rejection' | 'consent_given' | 'consent_revoked';
  search?: string;
  page?: number;
  limit?: number;
}
interface DeviceData {
  browser?: string;
  os?: string;
  screen_width?: number;
  screen_height?: number;
}
interface CreateEvent {
  event_type: 'view' | 'submission' | 'approval' | 'rejection' | 'consent_given' | 'consent_revoked';
  testimonio_id?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  device_data?: DeviceData
}
export function  useAnalyticsServices() {
  const { data: session } = useSession();
  const {currentOrganization} = useStore();
  const getOrganizationAnalytics = async ({ filters}: { filters: Filters}) => {
    const {data} = await api.get(`/organizations/${currentOrganization}/analytics/events`, {
      headers: {
        'Authorization': `Bearer ${session?.user?.accessToken}`
      },
      params: {
        event_type: filters.event_type,
        start_date: filters.start_date,
        end_date: filters.end_date,
        search: filters.search, 
        page: filters.page,
        limit: filters.limit,
      }},
      
    );
    return data.data;
  };
  const getEventDetails = async ({ eventId }: { eventId: string }) => {
    const {data} = await api.get(`/organizations/${currentOrganization}/analytics/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${session?.user?.accessToken}`
      },
    });
    return data.data;
  };
  const createEvent = async ({ metadata}: {metadata?: CreateEvent}) => {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return api.post(`/organizations/${currentOrganization}/analytics/events`, {
        event_type: metadata?.event_type,
        testimonio_id: metadata?.testimonio_id,
        ip_address: data.ip,
        user_agent: navigator.userAgent,
        referrer: window.location.origin,
        device_data: metadata?.device_data
      });
    };
  return {
    getOrganizationAnalytics,
    createEvent,
    getEventDetails,
  };
};