export type Place = {
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
};
