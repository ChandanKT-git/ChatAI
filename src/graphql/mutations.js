import { gql } from '@apollo/client'

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
      updated_at
      user_id
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($chatId: uuid!, $content: String!, $role: String!) {
    insert_messages_one(object: { 
      chat_id: $chatId, 
      content: $content, 
      role: $role 
    }) {
      id
      content
      role
      created_at
      chat_id
    }
  }
`

export const UPDATE_CHAT = gql`
  mutation UpdateChat($id: uuid!, $title: String!) {
    update_chats_by_pk(
      pk_columns: { id: $id },
      _set: { title: $title }
    ) {
      id
      title
      updated_at
    }
  }
`

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: uuid!, $message: String!) {
    sendMessage(chat_id: $chatId, message: $message) {
      success
      response
      error
    }
  }
`
