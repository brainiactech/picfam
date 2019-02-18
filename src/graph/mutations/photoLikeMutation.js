
import gql from "graphql-tag";

export const ADD_PHOTO_LIKE = gql`
    mutation($photo: ID!) 
    {
        addPhotoLike(photo:$photo){
            _id
        }
    }
`;