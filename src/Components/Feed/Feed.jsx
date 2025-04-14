import React, { useEffect, useState } from 'react';
import './Feed.css';
import { Link } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';

const Feed = ({ category }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
    try {
      const response = await fetch(videoList_url);
      if (!response.ok) {
        throw new Error("API request failed");
      }
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
    return <div className="feed-error">{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="feed-loading">Loading videos...</div>;
  }

  return (
    <div className="feed">
      {data.map((item, index) => (
        <Link key={index} to={`video/${item.snippet.categoryId}/${item.id}`} className="card">
          <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
          <h2>{item.snippet.title}</h2>
          <h3>{item.snippet.channelTitle}</h3>
          <p>
            {value_converter(item.statistics.viewCount)} Views &bull;{" "}
            {moment(item.snippet.publishedAt).fromNow()}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Feed;
