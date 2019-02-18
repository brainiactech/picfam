import gql from "graphql-tag";

export const ADD_GROUP = gql`
    mutation($title: String!, $description: String) {
        addGroup(title: $title, description: $description){
            title, description, created_at
        }
    }
`;