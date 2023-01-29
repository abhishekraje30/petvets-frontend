import React from 'react';
import axiosClient from '../api-client';
import '../css/home.css';
import image from '../assets/images/banner.png';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { Copyright } from '../MuiComponents/Copyright';
import dogImage from '../assets/images/dog.jpg';
import catImage from '../assets/images/cat.jpg';
import cowImage from '../assets/images/cow.jpg';
import birdImage from '../assets/images/bird.jpg';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  CardActionArea,
  Typography,
  CardMedia,
  CardActions,
} from '@mui/material';

const useStyles = makeStyles(() =>
  createStyles({
    blogCard: {
      maxHeight: '450px',
      height: '450px',
      margin: '10px',
      boxShadow: '0 4px 8px 0 rgb(0 0 0 / 20%)',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
  })
);

export const HomeContent = () => {
  const [blogData, setBlogData] = React.useState([]);
  const navigate = useNavigate();
  const classes = useStyles();
  const category = [
    {
      id: 1,
      name: 'dog',
      icon: <img src={dogImage} alt="dog" className="icon-img" />,
    },
    {
      id: 2,
      name: 'cat',
      icon: <img src={catImage} alt="dog" className="icon-img" />,
    },
    {
      id: 3,
      name: 'bird',
      icon: <img src={birdImage} alt="dog" className="icon-img" />,
    },
    {
      id: 4,
      name: 'cattle',
      icon: <img src={cowImage} className="icon-img" alt="cow" />,
    },
  ];

  const searchDoctor = (searchedDoctor, searchedCity) => {
    if (searchedDoctor && !searchedCity)
      navigate(`/findDoctor?doctor=${searchedDoctor.firstName}`);
    else if (!searchedDoctor && searchedCity)
      navigate(`/findDoctor?city=${searchedCity.name}`);
    else
      navigate(
        `/findDoctor?doctor=${searchedDoctor.firstName}&city=${searchedCity.name}`
      );
  };

  const findDoctor = (name) => {
    navigate('/findDoctor/?category=' + name);
  };

  React.useEffect(() => {
    const getBlogs = async () => {
      const blogs = await axiosClient.get('api/blogs/allBlogs');
      setBlogData(blogs.data.slice(0, 3));
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
      <div className="home-banner">
        <img src={image} alt="" className="banner-img" />
        {/* <div className="banner__content">
          <h1 className="banner-text">Find the best</h1>
          <h1 className="banner-text">vet near by you</h1>
        </div> */}
      </div>
      <Card class="banner-card">
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <SearchBar navigate={true} findDoctor={searchDoctor} />
        </Box>
        <Typography variant="h5" component="h2" class="blog-heading">
          Choose your pet
        </Typography>
        <Grid
          container
          spacing={1}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          class="category-grid"
        >
          {category.map((cat) => (
            <Grid item xs={12} sm={6} md={3} key={cat.id}>
              <Card
                sx={{ maxWidth: 245 }}
                className="category-card"
                onClick={() => findDoctor(cat.name)}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      class="icon-pos"
                    >
                      {cat.icon}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <>
          <Typography variant="h5" component="h2" class="blog-heading">
            Our Blogs
          </Typography>
          <Typography variant="h3" component="h2" class="blog-subhead">
            From Our Blog News
          </Typography>
        </>
        <Grid container spacing={2} style={{ margin: '15px' }}>
          {blogData.map((blog) => (
            <Grid item xs={12} md={4}>
              <Card
                sx={{ maxWidth: 345, maxHeight: 450 }}
                key="blog._id"
                className={classes.blogCard}
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
        <Copyright />
      </Card>
    </>
  );
};
