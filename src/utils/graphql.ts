import {THE_GRAPH_URL} from "../config";
import { request, gql } from 'graphql-request'

export enum FriendStatus{
    Request = 'Request',
    Friend = 'Friend',
    None = 'None'
}

export interface Friend{
    requestUser: string,
    receiveUser: string,
    status: FriendStatus
}
export const getRequestedFriendData = async(
    receiveUser: string
): Promise<Friend[]> =>{
    try{
        const response = await request(
            THE_GRAPH_URL,
            gql`
            query getFriendList ($receiveUser: String!) {
                request_list(receiveUser: $receiveUser){
                   requestUser,
                   status
                }
            }
            `,
            { receiveUser}
        );
        const friends:Friend[] = response.request_list;
        return (!friends) ? [] : friends;
    }catch (error){
        return [];
    }
}
export const getFriendData = async(
    requestUser: string
): Promise<Friend[]> =>{
    try{
        const response = await request(
            THE_GRAPH_URL,
            gql`
            query getFriendList ($requestUser: String!) {
                list(requestUser: $requestUser){
                   receiveUser,
                   status
                }
            }
            `,
            { requestUser}
        );
        const friends:Friend[] = response.list;
        return (!friends) ? [] : friends;
    }catch (error){
        console.log(error);
        return [];
    }
}



export const requestFriend = async (
    requestUser: string,
    receiveUser: string
):Promise<boolean> => {

    try{
        const response = await request(
            THE_GRAPH_URL,
            gql`
        mutation getRequest( $requestUser: String!, $receiveUser: String!){
          request(requestUser: $requestUser, receiveUser: $receiveUser){
            requestUser,
            receiveUser,
            status
          }
        }
        `,
            {requestUser, receiveUser}
        );
        if (!response){
            return false;
        }
        return true;

    }catch(error){
        return false;
    }
}

export const acceptFriend= async(
    receiveUser: string,
    requestUser: string
):Promise<boolean> =>{
    try{
        const response = await request(
            THE_GRAPH_URL,
            gql`
        mutation getAccept( $requestUser: String!, $receiveUser: String!){
          accept(requestUser: $requestUser, receiveUser: $receiveUser){
            requestUser,
            receiveUser,
            status
          }
        }
        `,
            {requestUser, receiveUser}
        );
        if (!response){
            return false;
        }
        return true;

    }catch(error){
        return false;
    }
}