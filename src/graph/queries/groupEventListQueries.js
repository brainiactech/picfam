import gql from "graphql-tag";

export const GET_GROUP_EVENTLIST = gql`
query getGroup ($groupId: ID!){
  
    getGroup (_id: $groupId){
        title,description
        event{
          _id,title, description
        }
    }
  }
`
;
