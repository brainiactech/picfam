import gql from "graphql-tag";

export const MAKE_GROUP_ADMIN = gql`
    mutation($groupMemberId: ID!) {
        makeGroupAdmin(_id: $groupMemberId){
            user_type
        }
    }
`;