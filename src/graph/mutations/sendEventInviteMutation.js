import gql from "graphql-tag";

export const SEND_EVENT_INVITE = gql`
    mutation($receiverUser: String!, $event: String!,$status: String!,$requestType:String!) {
        sendEventInvite(receiverUser: $receiverUser, event:$event, status: $status, requestType:$requestType){
           _id,status
        }
    }
`;