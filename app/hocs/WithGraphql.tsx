import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { useMemo } from 'react'

type WithGraphqlProps = {
  children: any
}
export function WithGraphql({ children }: WithGraphqlProps) {
  const graphqlClient = useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        uri: '/api/graphql',
      }),
    [],
    // [auth.state.accessToken],
  )

  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>
}
