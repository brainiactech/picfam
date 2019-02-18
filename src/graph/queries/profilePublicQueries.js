import gql from "graphql-tag";

export const GET_PUBLIC_PROFILE = gql`
query  getPublicProfile($user: ID!) {

    getPublicProfile(user: $user){
        _id,first_name,last_name,country,state,bio
        user{
          username,image_path
        }
        groupMember {
          group{
            title,description,_id
          }
          member{
            _id
          }
        }
        eventMember{
          event{
            _id,title,description,e_type
          }
        }
    }
  }
`
;