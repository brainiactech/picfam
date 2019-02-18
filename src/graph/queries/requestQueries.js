import gql from "graphql-tag";

export const GET_REQUESTS = gql`
query {
    getRequests {
          _id,requestType
          group{
            _id,title,description,_id
          }
          event{
            _id,title,description,_id
          }
          photo{
            _id,image_url
          }
          senderUser{
              _id,username,image_path
              profile{
                  _id,first_name, last_name
              }
          }
        }
  }
`
;
