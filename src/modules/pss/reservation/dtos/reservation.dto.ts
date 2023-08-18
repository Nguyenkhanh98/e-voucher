export class ReservationDTO {
  href: string;
  key: string;
  number: number;
  bookingInformation: any;
  reservationSummary: any;
}

export class PassengerDTO {
  href: string;
  key: string;
  reference: number;
  reservationOwner: boolean;
  reservationStatus: any;
  fareApplicability: null;
  passengerTypeCode: any;
  reservationProfile: {
    lastName: string;
    firstName: string;
    middleName: string;
    title: string;
    gender: string;
    address: any;
    birthDate: string;
    nationCountry: any;
    personalContactInformation: {
      phoneNumber: string;
      mobileNumber: string;
      email: string;
      language: any;
      notificationPreferences: any;
    };
    businessContactInformation: any;
    destinationContactInformation: any;
    passport: string;
    loyaltyProgram: string;
    preBoard: string;
    status: any;
  };
  frequentFlyer: any;
  advancePassengerInformation: any;
  infants: any[];
  timestamp: string;
}

export class FlightDTO {}

export class SegmentJourneyDTO {
  scheduledTime: string;
  localScheduledTime: string;
  airport: {
    href: string;
    code: string;
    name: string;
    utcOffset: string;
  };
}

export class LegDTO {
  key: string;
  departure: SegmentJourneyDTO;
  arrival: SegmentJourneyDTO;
}
export class SegmentDTO {
  key: string;
  flight: {
    href: string;
    key: string;
    airlineCode: any;
    flightNumber: string;
    aircraftModel: any;

    departure: SegmentJourneyDTO;
    arrival: SegmentJourneyDTO;
    legs: LegDTO[];

    reservationStatus: {
      cancelled: boolean;
      open: boolean;
      finalized: boolean;
      external: boolean;
    };
  };
}

export class PassengerJourneyDetailDTO {
  href: string;
  key: string;
  passenger: {
    href: string;
    key: string;
  };
  segment: any;
  bookingKey: string;
  fareClass: any;
  bookingCode: any;
  cabinClass: any;
  realizedRevenue: any;
  shuttle: any;
  privateFares: any;
  ticketNumber: any;
  notes: string;
  reservationStatus: {
    confirmed: boolean;
    waitlist: boolean;
    standby: boolean;
    cancelled: boolean;
    open: boolean;
    finalized: boolean;
    external: boolean;
  };
  timestamp: string;
}
export class JourneyDTO {
  href: string;
  key: string;
  departure: SegmentJourneyDTO;
  segments: SegmentDTO[];
  passengerJourneyDetails: PassengerJourneyDetailDTO[];
  reservationStatus: {
    cancelled: boolean;
    open: boolean;
    finalized: boolean;
    external: boolean;
  };
}
export class ReservationByKeyDTO {
  href: string;
  key: string;
  number: number;
  locator: string;
  directParentReservation: any;
  subsidiaryReservations: null;
  bookingInformation: any;
  passengers: PassengerDTO[];
  insurancePolicies: any[];
  ancillaryPurchases: any[];
  seatSelections: any[];
  passengerLegDetails: any[];
  charges: any[];
  journeys: [JourneyDTO];
}
