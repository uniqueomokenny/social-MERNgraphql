import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Grid, Header } from 'semantic-ui-react';

import PostCard from '../components/PostCard';

function Home() {
  const {
    loading,
    data: { getPosts: posts }
  } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <Header as='h1'>Recent Posts</Header>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <Header as='h1'>loading posts</Header>
        ) : (
          posts &&
          posts.map(post => (
            <Grid.Column key={post.id} style={{ marginBottom: '1.4rem' }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default Home;
