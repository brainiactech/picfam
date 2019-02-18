import gql from "graphql-tag";

export const GET_PROFILE = gql`
query {
    getProfile{
        _id,state,country,first_name,last_name,location,bio,date_of_birth,sex
        user{
          _id,username,image_path
        }
        groupMember {
          _id,
          group{
            _id,title,description,_id
          }
          member{
            _id
          }
        }
        eventMember{
          _id
          event{
            _id,title,description
          }
        }
    }
  }
`
;
