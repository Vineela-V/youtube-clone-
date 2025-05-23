import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import {Box,Card,CardMedia,CardContent,Typography,Grid,CircularProgress,Alert,Link} from '@mui/material';

const Feed = ({ category }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
    try {
      const response = await fetch(videoList_url);
      if (!response.ok) throw new Error("API request failed");
      const json = await response.json();
      setData(json.items || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load videos. Please try again later.");
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  if (error) {
    return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  }

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {data.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Link
              component={RouterLink}
              to={`/video/${item.snippet.categoryId}/${item.id}`}
              underline="none"
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item?.snippet?.thumbnails?.medium?.url}
                  alt={item?.snippet?.title}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {item?.snippet?.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {item?.snippet?.channelTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value_converter(item?.statistics?.viewCount)} views • {moment(item?.snippet?.publishedAt).fromNow()}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Feed;
