import { BookingManagement } from "@/components/booking-management";
import { AppProvider } from "@/contexts/AppContext";

export default function BookingsPage() {
  return (
    <AppProvider>
      {" "}
      <BookingManagement />
    </AppProvider>
  );
}
