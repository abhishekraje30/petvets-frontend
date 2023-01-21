import React from 'react';
import axiosClient from '../api-client';
import { cities } from '../utils/cities';
import '../css/home.css';
import image from '../assets/images/animal.jpg';
import cowImage from '../assets/images/cow-custom.svg';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Autocomplete,
  TextField,
  Button,
  CardActionArea,
  Typography,
  CardMedia,
  CardActions,
} from '@mui/material';

export const HomeContent = () => {
  const [doctor, setDoctor] = React.useState([]);
  const [city, setCity] = React.useState([]);
  const [blogData, setBlogData] = React.useState([]);
  const navigate = useNavigate();
  const category = [
    {
      id: 1,
      name: 'dog',
      icon: <i className="fas fa-dog icon"></i>,
    },
    {
      id: 2,
      name: 'cat',
      icon: <i className="fas fa-cat icon"></i>,
    },
    {
      id: 3,
      name: 'bird',
      icon: <i className="fas fa-dove icon"></i>,
    },
    {
      id: 4,
      name: 'cattle',
      icon: (
        <img
          src={cowImage}
          className="icon"
          style={{ height: '100px' }}
          alt="cow"
        />
      ),
    },
  ];

  const findDoctor = (name) => {
    navigate('/findDoctor/?category=' + name);
  };

  const SearchCity = async (e) => {
    if (e.code === 'Enter') {
      const city = cities.filter((x) =>
        x.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setCity(city);
    }
  };
  const searchDoctor = async (e) => {
    if (e.code === 'Enter') {
      const doctors = await axiosClient.get(
        'es/results?doctor=' + e.target.value
      );
      setDoctor(doctors.data);
    }
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
        <div className="banner__content">
          <h1 className="banner-text">Find the best</h1>
          <h1 className="banner-text">vet near by you</h1>
        </div>
      </div>
      <Card sx={{ display: 'flex' }} class="banner-card">
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Autocomplete
                  className="input"
                  freeSolo
                  autoComplete
                  autoHighlight
                  options={
                    doctor.length ? doctor.map((doc) => doc.firstName) : []
                  }
                  onKeyDown={(e) => searchDoctor(e)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Find Doctor"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  className="input"
                  freeSolo
                  autoComplete
                  autoHighlight
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="City" />
                  )}
                  options={city.map((c) => c)}
                  onKeyDown={(e) => SearchCity(e)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button size="small" variant="contained" className="search-btn">
                  Find Now
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Box>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          marginTop="5%"
        >
          {category.map((cat) => (
            <Grid item xs={12} sm={6} md={3} key={cat.id}>
              <Card
                sx={{ maxWidth: 245 }}
                className="card"
                style={{ backgroundColor: 'white' }}
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
        {/* <Blog></Blog> */}
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
      </Card>
    </>
  );
};
