import gql from "graphql-tag";

export const GET_EVENT_MEMBERS = gql`
query getEventMembers($eventId: ID!) {

    getEventMembers (event: $eventId){
        _id,user_type
        user{
          _id,username,image_path
          profile{
              _id,last_name, first_name,bio
          }
        }
        event{
            _id,title
            description
        }
      
    }
  }
`
;