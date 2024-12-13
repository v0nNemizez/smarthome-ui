import { gql } from "@apollo/client";

export const LIVE_MEASUREMENT_SUBSCRIPTION = gql`
  subscription LiveMeasurement($homeId: ID!) {
    liveMeasurement(homeId: $homeId) {
      power
      accumulatedConsumption
      accumulatedCost
      currency
      minPower
      averagePower
      maxPower
    }
  }
`;

export const GET_WSS_ENDPOINT = gql`{
  viewer {
    websocketSubscriptionUrl
  }
}`;

export const GET_USERNAME = gql`
    query GetUsername {
        viewer {
            name
        }
    }
`;