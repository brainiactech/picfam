import gql from "graphql-tag";

export const GET_GROUPS = gql`
query {
    getGroups{
      title, description, _id
    }
  }
`
;
