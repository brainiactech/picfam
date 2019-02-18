import gql from "graphql-tag";

export default gql`
mutation($email: String!, $password: String!, $oneSignalPlayerId: String) {
  login(email: $email, password: $password, onesignal_playerId:$oneSignalPlayerId) {
      token
  }
}
`;