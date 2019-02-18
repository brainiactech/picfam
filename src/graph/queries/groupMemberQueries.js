import gql from "graphql-tag";

export const GET_GROUP_MEMBERS = gql`
query getGroupMembers($groupId: ID!) {

    getGroupMembers (_id: $groupId){
        _id,user_type
        user{
          _id,username,image_path
          profile{
              _id,last_name, first_name,bio
          }
        }
        group{
          _id,title
          description
        }
    }
  }
`
;