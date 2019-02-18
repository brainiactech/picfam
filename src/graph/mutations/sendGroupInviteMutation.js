import gql from "graphql-tag";

export const SEND_GROUP_INVITE = gql`
    mutation($receiverUser: String!, $group: String!,$status: String!,$requestType:String!) {
        sendGroupInvite(receiverUser: $receiverUser, group:$group, status: $status, requestType:$requestType){
           _id,status
        }
    }
`;