import React from 'react';
import { Form, Header, Button } from 'semantic-ui-react';
import { useForm } from '../util/hooks';
import { useMutation } from '@apollo/react-hooks';

import { FETCH_POSTS_QUERY, CREATE_POST } from '../util/graphql';

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });

      values.body = '';
    },
    onError(err) {
      console.log(err);
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <Form onSubmit={onSubmit} style={{ marginBottom: '1.2rem' }}>
      <Header as='h2'>Create a post</Header>
      {error && (
        <div className='ui error message' style={{ display: 'block' }}>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
      <Form.Field>
        <Form.Input
          placeholder='Hi world'
          name='body'
          onChange={onChange}
          value={values.body}
          error={error ? true : false}
        />

        <Button type='submit' color='teal'>
          Submit
        </Button>
      </Form.Field>
    </Form>
  );
}

export default PostForm;
