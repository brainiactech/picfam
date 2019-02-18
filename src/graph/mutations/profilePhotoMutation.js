import gql from "graphql-tag";

export const EDIT_PROFILE_PHOTO = gql`
    mutation($imageUrl:String!) {
        
        updateProfilePic(image_path:$imageUrl){
            _id
        }
    }
`;