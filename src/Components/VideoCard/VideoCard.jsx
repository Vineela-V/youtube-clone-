import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const VideoCard = ({ video }) => {
  const { snippet } = video;

  return (
    <Card sx={{ maxWidth: 345, mb: 2 }}>
      <CardMedia
        component="img"
        height="180"
        image={snippet.thumbnails.medium.url}
        alt={snippet.title}
      />
      <CardContent>
        <Typography variant="subtitle1">{snippet.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {snippet.channelTitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
