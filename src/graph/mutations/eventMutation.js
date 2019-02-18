import gql from "graphql-tag";

export const ADD_EVENT = gql`
    mutation($title: String!, $eventType: String!, $description: String, $group: String!) {
        addEvent(title: $title, e_type:$eventType, description: $description, group: $group){
            title, description, created_at
        }
    }
`;