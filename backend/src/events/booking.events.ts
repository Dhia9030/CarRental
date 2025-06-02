export enum BookingEventType {
    BOOKING_CREATED = 'booking.created',
    BOOKING_UPDATED = 'booking.updated'
  }


  export interface BookingEvent {
    type: BookingEventType;
    data: any;
    timestamp: Date;
    bookingId: number;
  }