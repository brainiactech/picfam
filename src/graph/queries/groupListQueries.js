import gql from "graphql-tag";

export const GET_GROUPLIST = gql`
query {
        getUserGroups {
          user_type
          group{
            title,description,_id
          }
          member{
            _id
          }
        }
  }
`
;
