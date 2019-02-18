import gql from "graphql-tag";

export default gql`
  mutation signup(
    $username: String!
    $email: String!
    $password: String!
    $imagePath: String!
    $oneSignalPlayerId: String
    ) {
        signup(
        username: $username
        email: $email
        password: $password
        image_path: $imagePath
        onesignal_playerId: $oneSignalPlayerId
        ) {token}
      }
`;