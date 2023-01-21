import React from 'react';
import BlogDetail from './BlogDetail';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api-client';
import '../css/blog.css';
import {
  Card,
  CardContent,
  Grid,
  Button,
  CardMedia,
  CardActions,
  Typography,
} from '@mui/material';

const Blog = () => {
  const [blogData, setBlogData] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const getBlogs = async () => {
      const blogs = await axiosClient.get('api/blogs/allBlogs');
      setBlogData(blogs.data);
    };
    getBlogs();
  }, []);

  const goToBlog = (blog) => {
    navigate({
      pathname: '/blogDetail',
      search: '?id=' + blog._id,
    });
  };

  return (
    <>
      <Grid container spacing={2} style={{ margin: '15px' }}>
        {blogData.map((blog) => (
          <Grid item xs={4}>
            <Card
              sx={{ maxWidth: 345, maxHeight: 450 }}
              key="blog.title"
              class="blog-card"
            >
              <CardMedia sx={{ height: 140 }} image={blog.image} src="" />
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  {blog.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {blog.article}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  style={{ marginLeft: 'auto', marginRight: 'auto' }}
                  onClick={() => goToBlog(blog)}
                >
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Blog;
