import gql from "graphql-tag";

export const RESPOND_2_JOIN = gql`
    mutation($requestId: ID!, $responseType: String!) {
        respond2JoinEventRequest(_id: $requestId, response_type:$responseType){
           status
        }
    }
`;