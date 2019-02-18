import gql from "graphql-tag";

export const ADD_PHOTO = gql`
    mutation($imageUrl: String!, $event: String!, $description: String) 
    {
        addPhoto(image_url: $imageUrl, event:$event, description: $description){
            _id,image_url
            user{
                _id, username
            }
        }
    }
`;
