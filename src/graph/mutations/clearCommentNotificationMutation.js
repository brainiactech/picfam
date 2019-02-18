import gql from "graphql-tag";

export const CLEAR_COMMENT_NOTIFICATION = gql`
    mutation($requestId: ID!) {
        clearCommentNotification(_id: $requestId){
           status
        }
    }
`;