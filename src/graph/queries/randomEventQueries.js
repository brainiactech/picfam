import gql from "graphql-tag";

export const GET_RANDOM_EVENTS = gql`
query {
    getRandomEvents{
        _id,title,description
        group{
            _id
            user{
                _id,image_path
            }
        }
      }
  }
`
;
