import gql from "graphql-tag";

export const GET_USER_EVENTS = gql`
query {
   getUserEvents{
        user_type
        event{
          _id,title,description,e_type
          photo{
            image_url
          }
        }
      }
  }
`
;
