import axios from "axios";

import { NextRequest } from "next/server";
// To handle a GET request to /api
const GET = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get("query");
  const client = axios.create({
    baseURL: "https://places.googleapis.com/v1",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
    },
  });
  try {
    const response = await client.post(
      `/places:searchText`,
      {
        textQuery: query,
      },
      {
        headers: {
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.location,places.formattedAddress",
        },
      }
    );
    return Response.json(response.data);
  } catch (error) {
    console.log("error");
    console.log(JSON.stringify(error, null, 2));
    return Response.error();
  }
};
export { GET };
