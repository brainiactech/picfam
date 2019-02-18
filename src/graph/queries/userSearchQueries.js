import gql from "graphql-tag";

export const USER_SEARCH = gql`
query userSearch($searchQuery: String!) {

    userSearch(params:$searchQuery) {
          _id
          username
          onesignal_playerId
    }
}
`
;
