import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import VideoCard from "../Components/VideoCard/VideoCard";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("q") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(
            searchTerm
          )}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&type=video`
        );
        const data = await response.json();
        if (data.items) {
          setVideos(data.items);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchVideos();
    } else {
      setVideos([]);
      setLoading(false);
    }
  }, [searchTerm]);

  if (loading) return <CircularProgress />;

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Results for "{searchTerm}"
      </Typography>
      {videos.length > 0 ? (
        videos.map((video) => <VideoCard key={video.id.videoId} video={video} />)
      ) : (
        <Typography>No results found.</Typography>
      )}
    </Box>
  );
};

export default SearchResults;
