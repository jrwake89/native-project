export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  images: any[];
  description: string;
  isGoing: boolean;
}

export interface EventCardProps {
  event: Event;
  isActive: boolean;
  onSwipe?: () => void;
  onHeartPress?: (event: Event) => void;
  onXPress?: (event: Event) => void;
} 