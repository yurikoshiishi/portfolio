/* eslint-disable react/display-name */
import React, { useEffect, useRef } from "react";
import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    width: "100%",
    height: "0",
    paddingBottom: "56.25%",
    overflow: "hidden",
    "& iframe": {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: "0",
      left: "0",
    },
  },
}));

const YouTubeVideo = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { videoId } = props;
  const player = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      // If not, load the script asynchronously
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      // onYouTubeIframeAPIReady will load the video after the script is loaded
      window.onYouTubeIframeAPIReady = loadVideo;

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      // If script is already there, load the video directly
      loadVideo();
    }
  }, [loadVideo]);

  const loadVideo = useCallback(() => {
    player.current = new window.YT.Player(`youtube-video-${videoId}`, {
      videoId: videoId,
      playerVars: { autoplay: 1, loop: 1, playlist: videoId },
      events: {
        onReady: onPlayerReady,
      },
    });
  }, [videoId]);

  const onPlayerReady = (e) => {
    e.target.playVideo();
    e.target.setPlaybackRate(1.5);
  };

  return (
    <Box ref={ref} className={classes.container}>
      <div id={`youtube-video-${videoId}`} />
    </Box>
  );
});

export default YouTubeVideo;
