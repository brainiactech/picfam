import gql from "graphql-tag";

export const SEND_JOIN_EVENT_REQUEST = gql`
    mutation($receiverUser: String!, $event: String, $status: String!, $requestType: String!) {
        sendJoinEventRequest(receiverUser: $receiverUser, event: $event, status: $status, requestType: $requestType){
           _id,status
        }
    }
`;