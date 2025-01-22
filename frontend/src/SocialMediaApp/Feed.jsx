import { useState, useEffect } from 'react';
import { Container, TextField, Button, Card, CardContent, Typography, Avatar, IconButton, Input } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import { v4 as uuidv4 } from 'uuid'; // To generate unique post IDs

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [image, setImage] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Commented out the API call for fetching posts
        // const response = await axios.get('/api/posts');
        // setPosts(response.data);

        // Dummy posts data for testing
        const dummyPosts = [
          { _id: '1', userId: { username: 'User1', profilePic: '/path/to/profile1.jpg' }, content: 'This is a test post.', image: '/path/to/image1.jpg', likes: 5, comments: [] },
          { _id: '2', userId: { username: 'User2', profilePic: '/path/to/profile2.jpg' }, content: 'Another post for testing.', image: null, likes: 2, comments: [] },
        ];
        setPosts(dummyPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handlePost = () => {
    try {
      // Commented out the API call for creating a new post
      // const response = await axios.post('/api/posts', { userId: 'USER_ID', content: newPost, image: image });
      // setPosts([response.data, ...posts]);

      // Dummy post for testing
      const newDummyPost = {
        _id: uuidv4(),
        userId: { username: 'USER_ID', profilePic: '/path/to/profile.jpg' },
        content: newPost,
        image: image ? URL.createObjectURL(image) : null, // Use the uploaded image if any
        likes: 0,
        comments: [],
      };
      setPosts([newDummyPost, ...posts]);
      setNewPost('');
      setImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleAddComment = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        const newCommentObj = { id: uuidv4(), content: newComment };
        return { ...post, comments: [...post.comments, newCommentObj] };
      }
      return post;
    });
    setPosts(updatedPosts);
    setNewComment('');
  };

  return (
    <Container>
      <h1>Feed</h1>

      {/* Post creation */}
      <TextField
        label="What's on your mind?"
        fullWidth
        margin="normal"
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
      />
      <Input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        style={{ marginBottom: '16px' }}
      />
      <Button variant="contained" color="primary" onClick={handlePost}>Post</Button>

      {/* Posts list */}
      {posts.map((post) => (
        <Card key={post._id} style={{ marginTop: '16px' }}>
          <CardContent>
            {/* Post Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Avatar src={post.userId.profilePic} alt={post.userId.username} />
              <Typography variant="h6" style={{ marginLeft: '8px' }}>
                {post.userId.username}
              </Typography>
            </div>

            {/* Post Content */}
            <Typography>{post.content}</Typography>
            {post.image && <img src={post.image} alt="Post Image" style={{ width: '100%', marginTop: '8px' }} />}

            {/* Post Interactions */}
            <div style={{ display: 'flex', marginTop: '8px', alignItems: 'center' }}>
              <IconButton onClick={() => handleLike(post._id)}>
                <ThumbUpIcon />
              </IconButton>
              <Typography variant="body2">{post.likes} Likes</Typography>

              <IconButton style={{ marginLeft: '16px' }} onClick={() => handleAddComment(post._id)}>
                <CommentIcon />
              </IconButton>
              <Typography variant="body2">{post.comments.length} Comments</Typography>

              <IconButton style={{ marginLeft: '16px' }}>
                <ShareIcon />
              </IconButton>
              <Typography variant="body2">Share</Typography>
            </div>

            {/* Comment Section */}
            <TextField
              label="Add a comment"
              fullWidth
              margin="normal"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            {post.comments.map((comment) => (
              <Typography key={comment.id} style={{ marginLeft: '16px', marginTop: '8px' }}>
                {comment.content}
              </Typography>
            ))}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default Feed;