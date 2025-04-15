import React, { useEffect, useState } from 'react'
import './Playvideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'

const PlayVideo = ({ videoId }) => {
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);

    const fetchVideoData = async () => {
        try {
            const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&key=${API_KEY}&id=${videoId}`;
            const res = await fetch(videoDetails_url);
            const data = await res.json();
            if (data.items && data.items.length > 0) {
                setApiData(data.items[0]);
            }
        } catch (error) {
            console.error('Error fetching video data:', error);
        }
    }

    const fetchOtherData = async () => {
        if (!apiData || !apiData.snippet || !apiData.snippet.channelId) return;

        try {
            const channelLogo_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
            const channelRes = await fetch(channelLogo_url);
            const channelJson = await channelRes.json();
            if (channelJson.items && channelJson.items.length > 0) {
                setChannelData(channelJson.items[0]);
            }

            const videoComment_url = `https://www.googleapis.com/youtube/v3/commentThreads?textFormat=plainText&part=snippet&maxResults=50&key=${API_KEY}&videoId=${videoId}`;
            const commentRes = await fetch(videoComment_url);
            const commentJson = await commentRes.json();
            if (commentJson.items) {
                setCommentData(commentJson.items);
            }
        } catch (error) {
            console.error("Error fetching other data:", error);
        }
    }

    useEffect(() => {
        fetchVideoData();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (apiData) {
            fetchOtherData();
        }
    }, [apiData]);

    return (
        <div className="play-video">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?&autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>

            <h3>{apiData?.snippet?.title || "Title Here"}</h3>

            <div className="play-video-info">
                <p>
                    {apiData ? value_converter(apiData.statistics.viewCount) : 1525} Views &bull;{" "}
                    {apiData ? moment(apiData.snippet.publishedAt).fromNow() : "2 days ago"}
                </p>
                <div>
                    <span><img src={like} alt="" />{apiData ? value_converter(apiData.statistics.likeCount) : 125}</span>
                    <span><img src={dislike} alt="" />2</span>
                    <span><img src={share} alt="" />Share</span>
                    <span><img src={save} alt="" />Save</span>
                </div>
            </div>

            <hr />

            <div className="publisher">
                <img src={channelData?.snippet?.thumbnails?.default?.url || ""} alt="" />
                <div>
                    <p>{apiData?.snippet?.channelTitle || ""}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "1M"} Subscribers</span>
                </div>
                <button type="button">Subscribe</button>
            </div>

            <div className="vid-description">
                <p>{apiData?.snippet?.description?.slice(0, 250) || "Description Here"}</p>
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 130} Comments</h4>

                {commentData.map((item, index) => {
                    const comment = item.snippet.topLevelComment.snippet;
                    return (
                        <div key={index} className="comment">
                            <img src={comment.authorProfileImageUrl} alt="" />
                            <div>
                                <h3>{comment.authorDisplayName} <span>{moment(comment.publishedAt).fromNow()}</span></h3>
                                <p>{comment.textDisplay}</p>
                                <div className="comment-action">
                                    <img src={like} alt="" />
                                    <span>{comment.likeCount}</span>
                                    <img src={dislike} alt="" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PlayVideo;
