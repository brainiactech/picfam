import gql from "graphql-tag";

export const EDIT_PROFILE = gql`
    mutation($firstName:String!, 
        $lastName:String!,
        $bio: String!,
        $sex:String!, 
        $dateOfBirth:String!, 
        $country: String,
        $state: String, 
        $imagePath:String) {
        
        updateProfile(first_name:$firstName, 
            last_name: $lastName, 
            bio: $bio,
            country: $country, 
            state: $state, 
            sex: $sex,
            date_of_birth: $dateOfBirth,
            image_path: $imagePath){
            _id
        }
    }
`;