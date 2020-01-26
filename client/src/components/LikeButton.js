import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import { LIKE_POST_MUTATION } from '../util/graphql';
import MyPopup from '../util/MyPopup';

function LikeButton({ post, user }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && post.likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, post.likes]);

  const likedButton = user ? (
    liked ? (
      <Button color='teal'>
        <Icon name='heart' />
      </Button>
    ) : (
      <Button color='teal' basic>
        <Icon name='heart' />
      </Button>
    )
  ) : (
    <Button as={Link} to='/login' color='teal' basic>
      <Icon name='heart' />
    </Button>
  );

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: post.id },
    onError: err => {
      console.log(err);
    }
  });

  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
      <MyPopup content={liked ? 'Unlike' : 'Like'}>{likedButton}</MyPopup>
      <Label as='a' basic color='teal' pointing='left'>
        {post.likeCount}
      </Label>
    </Button>
  );
}

export default LikeButton;
