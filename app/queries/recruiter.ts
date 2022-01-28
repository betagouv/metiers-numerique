import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetRecruiters($pageIndex: Int!, $perPage: Int!, $query: String) {
    getRecruiters(pageIndex: $pageIndex, perPage: $perPage, query: $query) {
      count
      data {
        id

        createdAt
        fullName
        name
        updatedAt
        websiteUrl

        logoFile {
          id

          url
        }
      }
      index
      length
    }
  }
`

export const GET_ONE = gql`
  query GetRecruiter($id: String!) {
    getRecruiter(id: $id) {
      id

      createdAt
      fullName
      name
      updatedAt
      websiteUrl

      logoFile {
        id

        url
      }
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateRecruiter($input: RecruiterInput!) {
    createRecruiter(input: $input) {
      id
    }
  }
`

export const DELETE_ONE = gql`
  mutation DeleteRecruiter($id: ID!) {
    deleteRecruiter(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateRecruiter($id: String!, $input: RecruiterInput!) {
    updateRecruiter(id: $id, input: $input) {
      id
    }
  }
`