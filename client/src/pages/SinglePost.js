import React, { useContext, useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  FETCH_SINGLE_POST_QUERY,
  POST_COMMENT_MUTATION
} from '../util/graphql';
import {
  Grid,
  Card,
  Image,
  Button,
  Icon,
  Label,
  Form
} from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';

export default function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;

  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const deletePostCallback = () => {
    props.history.push('/');
  };

  const {
    data: { getPost: post }
  } = useQuery(FETCH_SINGLE_POST_QUERY, {
    variables: { postId }
  });

  const [submitComment] = useMutation(POST_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  let postMarkup;

  if (!post) {
    postMarkup = <p>Loading</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount
    } = post;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated='right'
              size='small'
              src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
            />
          </Grid.Column>

          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />

              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  as='div'
                  labelPosition='right'
                  onClick={() => console.log('comment')}
                >
                  <Button basic color='blue'>
                    <Icon name='comment' />
                  </Button>
                  <Label basic color='blue' pointing='left'>
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton
                    postId={id}
                    callback={() => deletePostCallback()}
                  />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        name='comment'
                        placeholder='Comment here...'
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        className='ui button teal'
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Comment
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}
