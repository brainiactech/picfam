import gql from "graphql-tag";

export const RESPOND_2_INVITE = gql`
    mutation($requestId: ID!, $responseType: String!) {
        respond2Invite(_id: $requestId, response_type:$responseType){
           status
        }
    }
`;