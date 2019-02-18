import gql from "graphql-tag";

export const GET_EVENTSCREEN = gql`
query getEvent ($eventId: ID!){
  
      getEvent (_id: $eventId){
        _id,title,description
        group{
          _id,title,
          user{
            _id,username
          }
        }
        eventMember{
          _id
          user{
            _id,username,image_path,email,onesignal_playerId
            profile{
              _id,first_name,last_name
            }
          }
          photo{
           _id,image_url
            photoComment{
              _id,comment
            }
            photoLike{
              _id
            }
          }
         }
    
      }
  }
`
;
