
import gql from "graphql-tag";

export const ADD_PHOTO_COMMENT = gql`
    mutation($comment: String!, $photo: ID!, $photoCreator: ID!) 
    {
        addPhotoComment(comment: $comment, photo:$photo, photoCreator:$photoCreator){
            _id
        }
    }
`;