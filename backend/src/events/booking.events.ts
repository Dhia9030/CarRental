export enum BookingEventType {
    BOOKING_CREATED = 'booking.created',
  }


  export interface BookingEvent {
    type: BookingEventType;
    data: any;
    timestamp: Date;
    bookingId: number;
  }