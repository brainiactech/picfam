import gql from "graphql-tag";

export const ADD_PHOTO_VIEW = gql`
    mutation($photo: ID!) 
    {
        updatePhotoView(photo:$photo){
            view
        }
    }
`;